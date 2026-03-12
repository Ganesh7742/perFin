import os
import httpx
import json
from pathlib import Path
from dotenv import load_dotenv
from groq import AsyncGroq
from schemas import FinancialProfileInput

# Load .env from same directory as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Stripping quotes from keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434").strip().rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:latest").strip()
USE_OLLAMA = os.getenv("USE_OLLAMA", "true").lower() == "true"

# Remove global instantiation that breaks event loops
model_available = bool(GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here")
_groq_client = None

def get_groq_client():
    global _groq_client
    if not _groq_client and model_available:
        _groq_client = AsyncGroq(api_key=GROQ_API_KEY)
        print(f"[OK] Groq AI lazily configured on first use.")
    return _groq_client

# Check Ollama on startup
if USE_OLLAMA:
    try:
        print(f"[*] Checking Ollama connection at {OLLAMA_URL}...")
        with httpx.Client(timeout=5.0) as client:
            resp = client.get(f"{OLLAMA_URL}/api/tags")
            if resp.status_code == 200:
                print(f"[OK] Ollama is reachable. Found models: {[m['name'] for m in resp.json().get('models', [])]}")
            else:
                print(f"[WARN] Ollama reachable but returned {resp.status_code}")
    except Exception as e:
        print(f"[ERROR] Ollama connection check failed: {e}")

# Recommended model for structured analysis/chat
GROQ_MODEL = "llama-3.3-70b-versatile"


def build_profile_context(profile: FinancialProfileInput) -> str:
    monthly_expenses = (
        profile.housing_expense + profile.food_expense + profile.transport_expense
        + profile.utilities_expense + profile.entertainment_expense
        + profile.other_expense + profile.monthly_loan_emi
    )
    surplus = profile.monthly_income - monthly_expenses
    total_assets = (
        profile.current_savings + profile.stocks + profile.mutual_funds
        + profile.gold + profile.crypto + profile.real_estate
    )
    net_worth = total_assets - (profile.total_loans + profile.credit_card_debt)

    goals_text = ""
    for g in profile.goals:
        goals_text += f"\n  - {g.goal_type}: Target ₹{g.target_amount:,.0f} in {g.time_horizon_years} years"

    return f"""
User Financial Profile:
- Name: {profile.name}, Age: {profile.age}
- Monthly Income: ₹{profile.monthly_income:,.0f}
- Monthly Expenses: ₹{monthly_expenses:,.0f}
- Monthly Surplus: ₹{surplus:,.0f}
- Total Assets: ₹{total_assets:,.0f}
- Net Worth: ₹{net_worth:,.0f}
- Goals: {goals_text if goals_text else "None specified"}
""".strip()


async def _call_ollama(prompt: str) -> str:
    """Async call to local Ollama API."""
    try:
        print(f"[*] Requesting Ollama ({OLLAMA_MODEL})...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            return response.json().get("response", "").strip()
    except Exception as e:
        print(f"[ERROR] Ollama error: {e}")
        raise


async def _call_ai(prompt: str) -> str:
    """Priority: Groq Cloud -> Ollama Local -> Error."""
    # Attempt Priority 1: Cloud AI (Groq)
    client = get_groq_client()
    if model_available and client:
        try:
            print(f"[*] Priority 1: Attempting Cloud AI (Groq: {GROQ_MODEL})...")
            chat_completion = await client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=GROQ_MODEL,
            )
            print("[OK] Groq responded successfully.")
            return chat_completion.choices[0].message.content.strip()
        except Exception as e:
            # We specifically want to catch 429 Resource Exhausted and other API errors
            print(f"[WARN] Groq Cloud error/quota hit: {e}")
            if USE_OLLAMA:
                print("[*] Falling back to Priority 2: local AI (Ollama)...")
            else:
                raise

    # Attempt Priority 2: Local AI (Ollama)
    if USE_OLLAMA:
        try:
            print(f"[*] Priority 2: Attempting local AI (Ollama: {OLLAMA_MODEL})...")
            return await _call_ollama(prompt)
        except Exception as e:
            print(f"[ERROR] Ollama also failed: {e}")
            raise
    
    raise Exception("No AI model available (Groq failed and Ollama is disabled or failed).")


async def get_ai_summary(profile: FinancialProfileInput) -> str:
    """Generates a quick AI summary of overall financial health."""
    try:
        context = build_profile_context(profile)
        prompt = f"""You are an expert Indian personal finance advisor.
{context}
Give a concise 3-4 sentence financial health summary covering:
1. Overall financial health
2. Key strengths
3. Areas of improvement
4. One actionable recommendation
Be direct, use ₹ for currency. Keep it under 150 words."""
        return await _call_ai(prompt)
    except Exception as e:
        print(f"[ERROR] AI Summary error: {e}")
        return generate_fallback_summary(profile)


async def get_chat_response(user_message: str, profile: FinancialProfileInput) -> str:
    """Generates a conversational AI response to a user's finance question."""
    try:
        context = build_profile_context(profile)
        prompt = f"""You are an expert Indian personal finance AI.
User's profile:
{context}
User's question: {user_message}
Answer as a knowledgeable advisor. Use ₹ for currency. Keep under 150 words."""
        return await _call_ai(prompt)
    except Exception as e:
        print(f"[ERROR] AI Chat error: {e}")
        return f"[WARN] AI Error: {str(e)[:100]}. Fallback: Please try again later."


def generate_fallback_summary(profile: FinancialProfileInput) -> str:
    monthly_expenses = (
        profile.housing_expense + profile.food_expense + profile.transport_expense
        + profile.utilities_expense + profile.entertainment_expense
        + profile.other_expense + profile.monthly_loan_emi
    )
    surplus = profile.monthly_income - monthly_expenses
    savings_rate = (surplus / profile.monthly_income * 100) if profile.monthly_income > 0 else 0
    return (
        f"Your savings rate is {savings_rate:.1f}%. Monthly surplus: ₹{surplus:,.0f}. "
        f"Consider building an emergency fund and diversifying investments."
    )
