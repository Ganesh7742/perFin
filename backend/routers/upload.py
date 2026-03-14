import os
import io
import json
import PyPDF2
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path
from auth_utils import get_current_user
from ai_advisor import get_groq_client, GROQ_MODEL

# Load .env
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")

router = APIRouter()

def get_gemini_client():
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    return genai.Client(api_key=GEMINI_API_KEY)

def extract_text_from_pdf(content: bytes) -> str:
    """Try to extract raw text from PDF using PyPDF2."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"PyPDF2 extraction failed: {e}")
        return ""

async def extract_with_groq(text: str) -> dict:
    """Use Groq to parse raw text into structured JSON."""
    client = get_groq_client()
    if not client:
        return None
    
    prompt = f"""
    Analyze the following financial document text and extract data into a valid JSON object.
    
    TEXT:
    {text}
    
    JSON SCHEMA:
    {{
      "name": "Full Name",
      "age": 0,
      "occupation": "Job Title",
      "location": "City",
      "marital_status": "Single/Married",
      "dependents": 0,
      "monthly_income": 0,
      "housing_expense": 0,
      "food_expense": 0,
      "transport_expense": 0,
      "utilities_expense": 0,
      "entertainment_expense": 0,
      "other_expense": 0,
      "total_deductions": 0,
      "current_savings": 0,
      "stocks": 0,
      "mutual_funds": 0,
      "gold": 0,
      "crypto": 0,
      "real_estate": 0,
      "existing_insurance": 0,
      "total_loans": 0,
      "credit_card_debt": 0,
      "monthly_loan_emi": 0,
      "cibil_score": 750,
      "credit_utilization": 0,
      "goals": [
        {{
          "goal_type": "string (e.g., Home, Education, Travel, Emergency Fund)",
          "target_amount": 0,
          "time_horizon_years": 0,
          "current_savings_for_goal": 0,
          "monthly_investment": 0,
          "priority": "High/Medium/Low"
        }}
      ]
    }}
    
    RULES:
    1. Output ONLY raw JSON. No markdown formatting.
    2. Use 0 or appropriate defaults for missing values.
    3. Ensure numbers are integers or floats.
    """
    
    try:
        response = await client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=GROQ_MODEL,
        )
        data_str = response.choices[0].message.content.strip()
        # Clean up possible markdown
        if data_str.startswith("```"):
            data_str = data_str.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
            if data_str.startswith("json"):
                data_str = data_str[4:].strip()
        return json.loads(data_str)
    except Exception as e:
        print(f"Groq parsing failed: {e}")
        return None

@router.post("/upload")
async def upload_financial_doc(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF and Images are supported.")

    try:
        content = await file.read()
        extracted_data = None
        
        # 1. HYBRID STEP: Try PyPDF2 + Groq first for digital PDFs
        if file.filename.lower().endswith('.pdf'):
            print(f"[*] Attempting local text extraction for {file.filename}...")
            raw_text = extract_text_from_pdf(content)
            
            if len(raw_text) > 50: # If we got substantial text
                print(f"[OK] Extracted {len(raw_text)} chars. Processing with Groq...")
                extracted_data = await extract_with_groq(raw_text)
                if extracted_data:
                    print("[OK] Groq extraction successful.")
                    return extracted_data

        # 2. FALLBACK STEP: Use Gemini Vision for Images or Scanned PDFs
        print(f"[*] Falling back to Gemini Vision (OCR) for {file.filename}...")
        client = get_gemini_client()
        
        prompt = """
        Analyze the provided document and extract ALL fields into a raw JSON.
        Fields: name, age, occupation, location, marital_status, dependents, monthly_income, 
        housing_expense, food_expense, transport_expense, utilities_expense, entertainment_expense, 
        other_expense, total_deductions, current_savings, stocks, mutual_funds, gold, crypto, 
        real_estate, existing_insurance, total_loans, credit_card_debt, monthly_loan_emi, 
        cibil_score, credit_utilization, goals.
        
        For goals, it should be an array of objects with the following keys:
        goal_type (string), target_amount (number), time_horizon_years (number), 
        current_savings_for_goal (number), monthly_investment (number), priority (High/Medium/Low).
        
        Use 0 for missing values. Output ONLY raw JSON.
        """

        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash-lite',
                contents=[
                    types.Part.from_bytes(data=content, mime_type=file.content_type),
                    prompt
                ]
            )
            extracted_text = response.text.strip()
            
            # Clean up markdown
            if extracted_text.startswith("```"):
                extracted_text = extracted_text.split("\n", 1)[1].rsplit("\n", 1)[0].strip()
                if extracted_text.startswith("json"):
                    extracted_text = extracted_text[4:].strip()

            return json.loads(extracted_text)

        except Exception as api_err:
            if "429" in str(api_err):
                raise HTTPException(status_code=429, detail="API limit reached. If this is a digital PDF, try again. If it's a photo, wait 1 minute.")
            raise api_err

    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload/Extraction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
