# IronChat

IronChat is a simple full-stack AI chatbot built with a React frontend and a FastAPI backend. The frontend gives users a clean chat interface, while the backend sends messages to Groq and returns AI replies.

## Features

- Beautiful beginner-friendly chatbot UI
- React + Vite frontend
- FastAPI backend
- Groq AI chat completion integration
- Simple `/chat` API endpoint
- Loading indicator while the bot is thinking
- Friendly frontend error messages when the backend is unavailable

## Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Python
- FastAPI
- Groq SDK
- Pydantic settings
- Uvicorn

## Project Structure

```text
IronChat/
├── backend/
│   ├── app/
│   │   ├── api/routes/chat.py
│   │   ├── core/config.py
│   │   └── schemas/chat.py
│   ├── main.py
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sulemangulzar/ironchat.git
cd ironchat
```

## Backend Setup

The backend runs on `http://localhost:8001`.

### 1. Go to the backend folder

```bash
cd backend
```

### 2. Create a `.env` file

Create a file named `.env` inside the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:5173
```

You can get a Groq API key from the Groq Console.

For deployment, set `REDIS_URL` to your Redis database URL and set `ALLOWED_ORIGINS` to your frontend URL. You can also add multiple frontend URLs separated by commas:

```env
REDIS_URL=your_render_redis_url
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

### 3. Install backend dependencies

If you use `uv`:

```bash
uv sync
```

If you prefer `pip`, create a virtual environment first, then install dependencies from `pyproject.toml`.

### 4. Start the backend server

```bash
uvicorn main:app --reload --port 8001
```

Health check:

```text
http://localhost:8001/health
```

## Frontend Setup

The frontend runs on `http://localhost:5173`.

### 1. Open a new terminal and go to the frontend folder

```bash
cd frontend
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Create a frontend `.env` file

Create a file named `.env` inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:8001
```

This tells the React app where your FastAPI backend is running.

### 4. Start the frontend development server

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:5173
```

## How It Works

1. The user types a message in the IronChat frontend.
2. The frontend sends the message to the backend using `POST ${VITE_API_URL}/chat`.
3. FastAPI receives the message and sends it to Groq.
4. Groq returns an AI response.
5. The backend sends the reply back to the frontend.
6. The frontend displays the reply in the chat window.

## API Endpoint

### `POST /chat`

Request body:

```json
{
  "session_id": "unique-user-session-id",
  "message": "Hello IronChat!"
}
```

Success response:

```json
{
  "reply": "Hello! How can I help you today?"
}
```

## Useful Commands

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
uvicorn main:app --reload --port 8001
```

## Notes

- Do not commit your `.env` file or API keys.
- Make sure the backend is running before sending messages from the frontend.
- The frontend reads the backend URL from `frontend/.env` using `VITE_API_URL`.
- If `VITE_API_URL` is not set, the frontend falls back to `http://localhost:8001`.

## License

This project is for learning and practice.
