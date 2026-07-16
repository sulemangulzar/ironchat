# IronChat

IronChat is a modern, responsive, and elegant AI chatbot application designed for quick questions, helpful answers, and smooth conversational flows. It leverages the raw speed of Llama-3 through Groq's APIs to provide real-time streaming answers.

## Features

- **Blazing Fast AI Responses**: Powered by Llama-3 70b via Groq for near-instant inference.
- **Intelligent Routing**: Features an advanced LLM-based router that automatically classifies queries, routing them to the internal knowledge base, web search, or standard chat based on context.
- **Document QA (RAG)**: Seamlessly search internal documentation and PDF context using Voyage AI embeddings stored in a Qdrant vector database.
- **Live Web Research**: Manually toggleable web search integration powered by Tavily, allowing the assistant to pull live news, facts, and events directly into the conversation.
- **Premium UI/UX**: Built with Tailwind CSS v4, featuring a glassmorphic dashboard, responsive layout, dark/light mode toggles, and smooth micro-animations.
- **Secure Authentication**: Built-in user sign up, login, and session management using JWT access and refresh tokens.
- **Optimized Backend**: A robust FastAPI backend integrated with PostgreSQL (via Supabase), using advanced async SQLModel techniques and CTEs to minimize latency.
- **Streaming Messages**: Messages are streamed to the frontend via Server-Sent Events (SSE) for a typewriter-like feel.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS v4
- Standard custom React components (no external UI component libraries required)
- `marked` & `DOMPurify` for rendering secure Markdown responses

### Backend
- Python 3
- FastAPI
- SQLModel / SQLAlchemy (Asyncpg)
- PostgreSQL (AWS/Supabase)
- AsyncGroq API (Inference)
- Voyage AI (Embeddings)
- Qdrant (Vector Database)
- Tavily (Web Search API)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.10+
- PostgreSQL database
- API Keys: Groq, Voyage AI, Tavily, and a Qdrant Cluster URL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sulemangulzar/ironchat.git
   cd ironchat
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql+asyncpg://user:pass@host/db"
   GROQ_API_KEY="your_groq_api_key"
   JWT_SECRET_KEY="your_jwt_secret"
   VOYAGE_API_KEY="your_voyage_api_key"
   TAVILY_API_KEY="your_tavily_api_key"
   QDRANT_URL="your_qdrant_cluster_url"
   QDRANT_API_KEY="your_qdrant_api_key"
   ```
   Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL="http://127.0.0.1:8000"
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome. Feel free to open an issue or submit a pull request.
