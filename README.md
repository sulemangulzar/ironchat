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
```

You can get a Groq API key from the Groq Console.

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

### 3. Start the frontend development server

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:5173
```

## How It Works

1. The user types a message in the IronChat frontend.
2. The frontend sends the message to the backend using `POST http://localhost:8001/chat`.
3. FastAPI receives the message and sends it to Groq.
4. Groq returns an AI response.
5. The backend sends the reply back to the frontend.
6. The frontend displays the reply in the chat window.

## API Endpoint

### `POST /chat`

Request body:

```json
{
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
- The frontend expects the backend to run on port `8001`.

## License

This project is for learning and practice.
