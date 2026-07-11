# IronChat Frontend

Production-ready React + Tailwind frontend for IronChat.

## Features

- Landing page
- Signup and login screens
- Authenticated chat dashboard
- Chat sidebar
- Streaming AI responses
- Dark/light mode
- Responsive layout
- Environment-based backend URL

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8001
```

For production, set `VITE_API_URL` to your deployed backend URL, for example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```
