# ⚡ IronChat

IronChat is a high-performance, intelligent AI Chatbot application featuring **LangChain-powered Document Q&A (RAG)**, **Jina AI Embeddings**, **Live Web Research**, and **Groq Llama-3 Acceleration**.

With IronChat, users can upload PDF, DOCX, or TXT documents directly to individual chat sessions for isolated, context-aware document Q&A, conduct web research using Tavily, or engage in ultra-fast general conversation.

---

## ✨ Key Features

- ⚡ **Near-Instant LLM Inference**: Powered by Llama-3 (70B) via Groq's high-speed hardware acceleration for real-time streaming responses.
- 📄 **LangChain & Jina AI Document Q&A (RAG)**:
  - **Multi-Format Ingestion**: Supports `.pdf`, `.docx`, `.doc`, `.txt`, and `.md` file uploads.
  - **LangChain Integration**: Uses LangChain document loaders (`PyPDFLoader`, `Docx2txtLoader`, `TextLoader`) and `RecursiveCharacterTextSplitter` for intelligent chunking.
  - **Jina AI Embeddings**: Embedded using `jina-embeddings-v2-base-en` for deep semantic document search.
  - **Chat-Scoped Q&A**: Each uploaded document is isolated strictly to its parent chat session via Qdrant vector payload filters.
- 🌐 **Live Web Research**: Toggleable web research powered by Tavily for fetching real-time facts, current news, and live data with source citations.
- 🗑️ **Automatic Cascading Cleanup**: Deleting a chat session automatically purges all attached document records in PostgreSQL and clears all vector points from Qdrant.
- ☁️ **Resilient Storage Architecture**: Uploads files to Supabase Storage with automatic local filesystem fallbacks.
- 🎨 **Modern Premium UI/UX**: Built with React, Tailwind CSS v4, glassmorphism aesthetics, dark/light mode toggles, document badges, and responsive layouts.
- 🔐 **JWT Authentication**: Full user signup, login, password hashing, and access/refresh token rotation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v4, Glassmorphism
- **Markdown & Syntax**: `react-markdown` with `remark-gfm`
- **Streaming**: Server-Sent Events (SSE)

### Backend
- **Framework**: Python 3.10+ & FastAPI
- **Database & ORM**: PostgreSQL via SQLModel & Asyncpg (Alembic migrations)
- **LLM Engine**: Groq API (Llama-3 70B)
- **Document Processing**: LangChain (`langchain-community`, `PyPDFLoader`, `docx2txt`)
- **Embeddings**: Jina AI Embeddings (`jina-embeddings-v2-base-en`)
- **Vector Database**: Qdrant (`qdrant-client`)
- **Web Search**: Tavily Search API
- **File Storage**: Supabase Storage with local storage fallback

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed/configured:
- **Node.js**: v18+
- **Python**: v3.10+
- **PostgreSQL Database**: Local or hosted (e.g., Supabase / Neon / AWS RDS)
- **API Keys**: Groq, Jina AI, Tavily, and Qdrant Cluster URL/Key

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head
```

Create a `.env` file inside the `backend/` directory:

```env
# Database & Auth
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/ironchat"
JWT_SECRET_KEY="your_super_secret_jwt_key"
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174"

# AI Services
GROQ_API_KEY="gsk_..."
JINA_API_KEY="jina_..."
TAVILY_API_KEY="tvly-..."

# Qdrant Vector Store
QDRANT_URL="https://your-qdrant-cluster.qdrant.tech"
QDRANT_API_KEY="your_qdrant_api_key"

# Storage (Optional Supabase setup)
SUPABASE_REST_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
SUPABASE_BUCKET="documents"
```

Start the FastAPI backend:
```bash
uvicorn main:app --reload --port 8000
```

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL="http://127.0.0.1:8000"
```

Start the Vite development server:
```bash
npm run dev
```

Visit `http://localhost:5173` (or `http://localhost:5174`) in your browser to launch IronChat!

---

## 📖 Usage Guide

1. **Sign Up / Log In**: Create an account or sign in to your workspace.
2. **Start a New Chat**: Click `+ New Chat` in the sidebar.
3. **Upload a Document**: Click the paperclip icon (📎) in the message bar to attach a `.pdf`, `.docx`, or `.txt` document.
4. **Chat with your Document**: Ask questions about the uploaded document—IronChat will retrieve exact context chunks using Jina embeddings and provide precise answers.
5. **Web Research**: Click the **Web Research** toggle to allow IronChat to query live internet data.
6. **Chat Cleanup**: Delete a chat to automatically clean up all messages, Postgres document records, and Qdrant vector points.

---

## 📄 License

This project is licensed under the MIT License.
