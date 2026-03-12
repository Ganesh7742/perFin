import httpx
import asyncio
import json

BASE_URL = "http://localhost:8000/api"

async def test_auth_flow():
    email = "testuser@example.com"
    password = "SecurePassword123"

    print("🚀 Starting Authentication Flow Test...")

    async with httpx.AsyncClient() as client:
        # 1. Signup
        print("\n1️⃣ Testing Signup...")
        try:
            signup_resp = await client.post(
                f"{BASE_URL}/auth/signup",
                json={"email": email, "password": password}
            )
            print(f"Status: {signup_resp.status_code}")
            print(f"Response: {signup_resp.json()}")
        except Exception as e:
            print(f"Signup failed: {e}")

        # 2. Login
        print("\n2️⃣ Testing Login...")
        try:
            login_resp = await client.post(
                f"{BASE_URL}/auth/login",
                json={"email": email, "password": password}
            )
            print(f"Status: {login_resp.status_code}")
            login_data = login_resp.json()
            print(f"Response: {login_data}")
            token = login_data.get("access_token")
        except Exception as e:
            print(f"Login failed: {e}")
            return

        # 3. Protected Route (Root check or similar if implemented)
        print("\n3️⃣ Testing Protected Access (simulated)...")
        if token:
            print("Token received successfully! ✅")
        else:
            print("Token not received! ❌")

    print("\n✅ Verification script completed.")

if __name__ == "__main__":
    try:
        asyncio.run(test_auth_flow())
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Error running test: {e}")
