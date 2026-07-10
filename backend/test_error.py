import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

response = client.post("/auth/v1/signup", json={"name": "test", "email": "test@example.com", "password": "supersecure"})
print(response.status_code)
print(response.text)
