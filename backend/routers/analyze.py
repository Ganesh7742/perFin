from fastapi import APIRouter, HTTPException, Depends
from schemas import (
    FinancialProfileInput, AnalysisResponse,
)
from financial_engine import (
    calculate_monthly_expenses,
    calculate_total_assets,
    calculate_total_liabilities,
    calculate_net_worth,
    calculate_health_score,
    calculate_projections,
    calculate_goal_result,
    calculate_insurance_advice,
    calculate_tax_advice,
    calculate_cibil_advice,
)
from ai_advisor import get_ai_summary
from database import get_collection
import uuid
from auth_utils import get_current_user

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_profile(profile: FinancialProfileInput, current_user: dict = Depends(get_current_user)):
    try:
        # Core financial calculations
        monthly_expenses = calculate_monthly_expenses(profile)
        monthly_surplus = profile.monthly_income - monthly_expenses
        total_assets = calculate_total_assets(profile)
        total_liabilities = calculate_total_liabilities(profile)
        net_worth = calculate_net_worth(profile)
        health_score = calculate_health_score(profile)
        projections = calculate_projections(profile)
        goal_results = [calculate_goal_result(g, profile) for g in profile.goals]
        
        # Advisors
        insurance_advice = calculate_insurance_advice(profile)
        tax_advice = calculate_tax_advice(profile)
        cibil_advice = calculate_cibil_advice(profile)
        ai_summary = await get_ai_summary(profile)

        response = AnalysisResponse(
            user_id=current_user["id"],
            name=profile.name,
            monthly_income=profile.monthly_income,
            monthly_expenses=monthly_expenses,
            monthly_surplus=monthly_surplus,
            total_assets=total_assets,
            total_liabilities=total_liabilities,
            net_worth=net_worth,
            health_score=health_score,
            projections=projections,
            goals=goal_results,
            ai_summary=ai_summary,
            insurance_advice=insurance_advice,
            tax_advice=tax_advice,
            cibil_advice=cibil_advice,
        )

        # Persist to MongoDB
        users_col = get_collection("users")
        # Save both analysis and the actual profile for later use in simulators
        await users_col.update_one(
            {"_id": current_user["id"]},
            {"$set": {
                "latest_analysis": response.model_dump(),
                "profile": profile.model_dump()
            }}
        )

        return response
    except Exception as e:
        print(f"[ERROR] Analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyze/me", response_model=AnalysisResponse)
async def get_my_analysis(current_user: dict = Depends(get_current_user)):
    users_col = get_collection("users")
    user = await users_col.find_one({"_id": current_user["id"]})
    if not user or "latest_analysis" not in user:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return AnalysisResponse(**user["latest_analysis"])

@router.delete("/analyze/me")
async def delete_my_account(current_user: dict = Depends(get_current_user)):
    users_col = get_collection("users")
    await users_col.delete_one({"_id": current_user["id"]})
    return {"message": "Account and all data deleted successfully"}

@router.get("/analyze/export")
async def export_my_data(current_user: dict = Depends(get_current_user)):
    users_col = get_collection("users")
    user = await users_col.find_one({"_id": current_user["id"]})
    if not user or "latest_analysis" not in user:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {
        "metadata": {
            "version": "1.0",
            "source": "PerFin AI",
            "exported_at": str(uuid.uuid4())
        },
        "data": user["latest_analysis"]
    }

