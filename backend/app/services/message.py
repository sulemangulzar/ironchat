from groq._client import AsyncGroq
import asyncio
import json
import logging
from datetime import datetime, timezone
from uuid import UUID

from fastapi import BackgroundTasks


from app.core.config import settings
from app.models.message import Role
from app.repositories.chat import ChatRepository
from app.repositories.message import MessageRepository
from app.schemas.message import SendMessage
from app.api.v1.web_search import search_web


from app.core.voyage import embed_text          
from app.core.qdrant import qdrant_client      

RAG_COLLECTION_NAME = "ironchat_docs" 


# ============================================================
# SYSTEM PROMPTS
# ============================================================

SYSTEM_PROMPT = """
You are IronChat, an accurate and helpful AI assistant.

Answer only the LATEST user message. Do not continue previous tasks unless explicitly asked.

Answer from your own knowledge confidently and directly. If you are genuinely unsure about something, say so clearly rather than guessing.

## Style
- Use Markdown. Be concise for short questions. Use headings for long answers.
"""

RESEARCH_SYSTEM_PROMPT = """
You are IronChat, an accurate and helpful AI assistant with access to real-time web search results.

Answer only the LATEST user message. Do not continue previous tasks unless explicitly asked.

Web search results have been injected into this conversation as [SEARCH RESULTS]. Use them to answer accurately.
- Cite sources with [1], [2], etc. for every factual claim from search results.
- End with a ## Sources section listing numbered Markdown links.
- If results are insufficient, say so. Never fabricate facts.

## Style
- Write detailed, comprehensive answers. Fully explain the information you found.
- Use Markdown formatting (headings, bullet points, and tables) to organize your response.
- Always include the ## Sources section at the very end.
"""


RAG_SYSTEM_PROMPT = """
You are IronChat, an accurate and helpful AI assistant.

You have been given relevant excerpts from IronChat's own documentation, injected below as [DOCUMENT CONTEXT].
Answer the user's question using ONLY that context.

- If the answer isn't in the context, say "I don't have that information in the documentation."
- Do not make up details that aren't in the context.

## Style
- Use Markdown. Be concise and clear.
"""

ROUTING_PROMPT = """You are an intelligent routing assistant. Your job is to classify the user's LATEST message to determine how it should be answered.
You will see the conversation history for context, but you must ONLY base your decision on the LATEST message.

Reply with ONLY valid JSON — no explanation, no markdown, no extra text. Choose ONE of the following three formats:

1. Web Search Route (Current events, news, live prices, recent stats):
{"mode": "search", "query": "standalone search query with context resolved (e.g. 'Elon Musk net worth' instead of 'his net worth')"}

2. Documentation Route (Questions specifically about IronChat, its architecture, features, tech stack, or documentation):
{"mode": "rag"}

3. Simple Chat Route (General knowledge, programming help, writing tasks, or conversational chat):
{"mode": "simple"}
"""


class MessageService:

    def __init__(self, repository: MessageRepository, chat_repository: ChatRepository):
        self.repository = repository
        self.chat_repository = chat_repository
        self.groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    async def get_messages(self, chat_id: UUID, user_id: UUID):
        """Fetch all past messages for a chat, formatted for the frontend."""
        messages = await self.repository.get_all_messages_for_user(chat_id, user_id)
        return [
            {
                "id": str(m.id),
                "role": m.role.value,
                "content": m.content,
                "created_at": m.created_at,
            }
            for m in messages
        ]

    async def generate_response(
        self,
        chat_id: UUID,
        user_prompt: SendMessage,
        user_id: UUID,
    ):
        """
        Entry point: called whenever the user sends a new message.
        Builds the conversation history + system prompt, then hands off
        to _stream_response() which does the actual thinking/searching/answering.
        """
        chat = await self.chat_repository.get_one_chat(user_id, chat_id)
        history = await self.repository.get_all_messages(chat_id)

        history = history[-10:]
        prompt_text = user_prompt.content

        if not history:
            asyncio.create_task(self._update_title(chat_id, user_id, prompt_text))

        await self.repository.save_message(chat_id, Role.USER, prompt_text)

        messages = [{"role": m.role.value, "content": m.content} for m in history]
        messages.append({"role": "user", "content": prompt_text})

        return self._stream_response(
            chat,
            messages,
            enable_search=user_prompt.enable_search
        )

    async def _update_title(self, chat_id: UUID, user_id: UUID, prompt_text: str):
        """Generate and save a short title for a new chat."""
        from app.core.database import get_session
        new_title = prompt_text[:30] + ("..." if len(prompt_text) > 30 else "")
        async for session in get_session():
            try:
                repo = ChatRepository(session)
                chat = await repo.get_one_chat(user_id, chat_id)
                chat.title = new_title
                await repo.update_chat(chat)
            except Exception as e:
                logging.error(f"Title update failed: {e}")
            break

    async def _run_search(self, query: str) -> dict:
        """Execute a Tavily web search and return results."""
        try:
            return await search_web(query=query)
        except Exception as e:
            logging.error(f"Search failed: {e}")
            return {"results": []}

    # ============================================================
    # NEW: RAG retrieval — mirrors _run_search() exactly, but for documents
    # ============================================================
    async def _run_rag_retrieval(self, question: str, top_k: int = 3) -> list[str]:
        """
        Embed the user's question, search Qdrant for the closest document
        chunks, and return their raw text. Returns [] if nothing useful found.
        """
        try:
            question_vector = await asyncio.to_thread(embed_text, question)

            results = await qdrant_client.query_points(
                collection_name=RAG_COLLECTION_NAME,
                query=question_vector,
                limit=top_k,
            )

            chunks = [point.payload["text"] for point in results.points]
            return chunks

        except Exception as e:
            logging.error(f"RAG retrieval failed: {e}")
            return []

    async def _stream_response(
        self,
        chat,
        messages: list,
        enable_search: bool = False
    ):
        """
        The main response generator with intelligent routing.
        """
        def sse(data: dict) -> str:
            """Format a dict as a Server-Sent Event line."""
            return f"data: {json.dumps(data)}\n\n"

        full_content = ""
        citations = []

        try:
            # 1. Routing phase
            # By default, use simple chat instructions
            messages.insert(0, {"role": "system", "content": SYSTEM_PROMPT})
            
            # Construct dynamic routing prompt based on whether Web Search is enabled
            options_text = ""
            if enable_search:
                options_text = """1. Web Search Route (Current events, news, live prices, recent stats):
{"mode": "search", "query": "standalone search query with context resolved (e.g. 'Elon Musk net worth' instead of 'his net worth')"}

2. Documentation Route (Questions specifically about IronChat, its architecture, features, tech stack, or documentation):
{"mode": "rag"}

3. Simple Chat Route (General knowledge, programming help, writing tasks, or conversational chat):
{"mode": "simple"}"""
            else:
                options_text = """1. Documentation Route (Questions specifically about IronChat, its architecture, features, tech stack, or documentation):
{"mode": "rag"}

2. Simple Chat Route (General knowledge, programming help, writing tasks, or conversational chat):
{"mode": "simple"}"""

            dynamic_routing_prompt = f"""You are an intelligent routing assistant. Your job is to classify the user's LATEST message to determine how it should be answered.
You will see the conversation history for context, but you must ONLY base your decision on the LATEST message.

Reply with ONLY valid JSON — no explanation, no markdown, no extra text. Choose ONE of the following formats:

{options_text}
"""

            decision_messages = [{"role": "system", "content": dynamic_routing_prompt}]
            decision_messages += [m for m in messages if m["role"] != "system"]

            decision_resp = await self.groq_client.chat.completions.create(
                model=chat.model,
                messages=decision_messages,
                temperature=0,
                max_tokens=64,
                stream=False,
            )

            raw = decision_resp.choices[0].message.content or ""
            mode = "simple"
            query = None

            try:
                clean = raw.strip().strip("```json").strip("```").strip()
                decision = json.loads(clean)
                mode = decision.get("mode", "simple")
                if mode == "search" and decision.get("query"):
                    query = decision["query"]
            except Exception:
                logging.warning(f"Could not parse routing decision JSON: {raw!r} — defaulting to simple")

            # 2. Execution phase based on route
            if mode == "search" and query:
                yield sse({"type": "status", "status": "searching",
                           "message": "Searching the web", "query": query})

                result = await self._run_search(query)
                sources = result.get("results", [])

                for src in sources:
                    citations.append({
                        "title": src.get("title"),
                        "url": src.get("url"),
                        "content": src.get("content"),
                        "published_date": src.get("published_date"),
                    })

                if sources:
                    yield sse({"type": "search_results", "query": query, "sources": sources})
                    yield sse({"type": "status", "status": "reading",
                               "message": f"Reviewing {len(sources)} sources"})

                search_block = f"\n\n[SEARCH RESULTS for: {query}]\n"
                for i, src in enumerate(sources, 1):
                    search_block += f"\n[{i}] {src.get('title', '')}\nURL: {src.get('url', '')}\n{src.get('content', '')[:400]}\n"

                messages[0]["content"] = RESEARCH_SYSTEM_PROMPT
                messages.append({"role": "user", "content": search_block})

            elif mode == "rag":
                latest_question = messages[-1]["content"]

                yield sse({"type": "status", "status": "retrieving",
                           "message": "Checking IronChat documentation"})

                retrieved_chunks = await self._run_rag_retrieval(latest_question)

                if retrieved_chunks:
                    context_block = "\n\n[DOCUMENT CONTEXT]\n" + "\n---\n".join(retrieved_chunks)

                    messages[0]["content"] = RAG_SYSTEM_PROMPT
                    messages.append({"role": "user", "content": context_block})
                else:
                    logging.info("RAG retrieval returned no chunks — answering without document context")

            # ---------- FINAL ANSWER (unchanged, just runs after whichever context was added) ----------
            final_stream = await self.groq_client.chat.completions.create(
                model=chat.model,
                messages=messages,
                stream=True,
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.LLM_MAX_TOKENS,
                top_p=settings.LLM_TOP_P,
            )

            async for chunk in final_stream:
                text = chunk.choices[0].delta.content
                if text:
                    full_content += text
                    yield sse({"type": "content", "delta": text})

            if citations:
                seen, unique = set(), []
                for c in citations:
                    if c["url"] not in seen:
                        seen.add(c["url"])
                        unique.append(c)
                for i, c in enumerate(unique, 1):
                    c["id"] = i
                yield sse({"type": "citations", "sources": unique})

            yield sse({"type": "done"})

            if full_content:
                await self.repository.save_message(chat.id, Role.ASSISTANT, full_content)
                chat.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
                await self.chat_repository.update_chat(chat)
            else:
                logging.warning("Empty assistant response — not saved.")

        except Exception as e:
            logging.error(f"Response generation error: {e}")
            yield sse({"type": "error", "message": "Something went wrong. Please try again."})