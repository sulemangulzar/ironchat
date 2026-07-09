from fastapi import FastAPI
from app.api.routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="IronChat", version="0.1.0")




app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"message": "working"}

app.include_router(chat_router)
