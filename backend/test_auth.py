from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# 1. Login
login_res = client.post("/auth/v1/login", json={"email": "test@example.com", "password": "supersecure"})
if login_res.status_code != 200:
    print("Login failed:", login_res.status_code, login_res.text)
    exit(1)

tokens = login_res.json()
print("Tokens:", tokens)

# 2. Get Me
me_res = client.get("/auth/v1/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
if me_res.status_code != 200:
    print("Me failed:", me_res.status_code, me_res.text)
    exit(1)

print("Me:", me_res.json())

# 3. Refresh
refresh_res = client.post("/auth/v1/refresh", json={"refresh_token": tokens["refresh_token"]})
if refresh_res.status_code != 200:
    print("Refresh failed:", refresh_res.status_code, refresh_res.text)
    exit(1)

print("New Tokens:", refresh_res.json())
