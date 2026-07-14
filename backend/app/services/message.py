import asyncio
import json
import logging
from datetime import datetime, timezone
from uuid import UUID

from fastapi import BackgroundTasks
from groq import AsyncGroq

from app.core.config import settings
from app.models.message import Role
from app.repositories.chat import ChatRepository
from app.repositories.message import MessageRepository
from app.schemas.message import SendMessage
from app.api.v1.web_search import search_web


# ─── System Prompt ────────────────────────────────────────────────────────────

# System prompt used when web research is OFF — no mention of tools
SYSTEM_PROMPT = """
You are IronChat, an accurate and helpful AI assistant.

Answer only the LATEST user message. Do not continue previous tasks unless explicitly asked.

Answer from your own knowledge confidently and directly. If you are genuinely unsure about something, say so clearly rather than guessing.

## Style
- Use Markdown. Be concise for short questions. Use headings for long answers.
"""

# System prompt used when web research is ON — final answer prompt after search results are injected
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

# Prompt for the lightweight decision call — asks for plain JSON, no tool schema needed
DECISION_PROMPT = """You are a routing assistant. Your job is to decide if the user's LATEST message requires a live web search.
You will see the conversation history for context, but you must ONLY base your decision on the LATEST message.

Reply with ONLY valid JSON — no explanation, no markdown, no extra text:
{"search": true, "query": "standalone search query with context resolved (e.g. 'Elon Musk net worth' instead of 'his net worth')"}
OR
{"search": false}

Search when the latest message needs: current news, live prices, today's events, recent statistics, or real-time data.
Do NOT search for: programming help, general knowledge, writing tasks, or anything answerable from training data."""


# ─── Service ──────────────────────────────────────────────────────────────────

class MessageService:

    def __init__(self, repository: MessageRepository, chat_repository: ChatRepository):
        self.repository = repository
        self.chat_repository = chat_repository
        self.groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    # ── Public Methods ────────────────────────────────────────────────────────

    async def get_messages(self, chat_id: UUID, user_id: UUID):
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
        background_tasks: BackgroundTasks,
    ):
        chat = await self.chat_repository.get_one_chat(user_id, chat_id)
        history = await self.repository.get_all_messages(chat_id)

        # Keep last 10 messages to avoid hitting Groq's token-per-minute limit
        history = history[-10:]
        prompt_text = user_prompt.content

        # Update the chat title on the first message
        if not history:
            asyncio.create_task(self._update_title(chat_id, user_id, prompt_text))

        # Save the user's message to the database
        await self.repository.save_message(chat_id, Role.USER, prompt_text)

        # Build the messages list for the LLM
        # Use research prompt when search is enabled, plain prompt otherwise
        system_prompt = RESEARCH_SYSTEM_PROMPT if user_prompt.enable_search else SYSTEM_PROMPT
        messages = [{"role": "system", "content": system_prompt}]
        messages += [{"role": m.role.value, "content": m.content} for m in history]
        messages.append({"role": "user", "content": prompt_text})

        return self._stream_response(chat, messages, enable_search=user_prompt.enable_search)

    # ── Private Methods ───────────────────────────────────────────────────────

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

    async def _stream_response(self, chat, messages: list, enable_search: bool = False):
        """
        The main response generator.

        Flow:
          1. Ask the LLM (with tool access) whether to search or answer directly.
          2. If it wants to search → run the search, inject results, stream the final answer.
          3. If it answers directly → stream that answer.
        """
        def sse(data: dict) -> str:
            return f"data: {json.dumps(data)}\n\n"

        full_content = ""
        citations = []

        try:
            query = None
            citations = []

            # ── Step 1: Decide whether to search (only when user enabled it) ──
            if enable_search:
                # Build a history for the decision model so it can resolve pronouns (e.g. "his age")
                # but replace the main system prompt with the DECISION_PROMPT
                decision_messages = [{"role": "system", "content": DECISION_PROMPT}]
                decision_messages += [m for m in messages if m["role"] != "system"]

                # Ask a tiny routing model to return plain JSON — no tool schema,
                # no format issues, completely reliable.
                decision_resp = await self.groq_client.chat.completions.create(
                    model=chat.model,
                    messages=decision_messages,
                    temperature=0,       # deterministic
                    max_tokens=64,       # {"search": true, "query": "..."} fits in 64 tokens
                    stream=False,
                )

                raw = decision_resp.choices[0].message.content or ""
                try:
                    # Strip markdown fences if the model wraps in ```json ... ```
                    clean = raw.strip().strip("```json").strip("```").strip()
                    decision = json.loads(clean)
                    if decision.get("search") and decision.get("query"):
                        query = decision["query"]
                except Exception:
                    logging.warning(f"Could not parse search decision JSON: {raw!r} — skipping search")

            # ── Step 2: Run search if decided ────────────────────────────────
            if query:
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

                # Inject results as a plain user-readable block — no tool message needed
                search_block = f"\n\n[SEARCH RESULTS for: {query}]\n"
                for i, src in enumerate(sources, 1):
                    search_block += f"\n[{i}] {src.get('title', '')}\nURL: {src.get('url', '')}\n{src.get('content', '')[:400]}\n"

                # Append results to the conversation and switch to research prompt
                messages[0]["content"] = RESEARCH_SYSTEM_PROMPT
                messages.append({"role": "user", "content": search_block})

            # ── Step 3: Stream the final answer ──────────────────────────────
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

            # ── Step 4: Send citations and finish ─────────────────────────
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

