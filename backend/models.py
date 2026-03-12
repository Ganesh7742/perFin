"""
MongoDB document schemas (plain dicts / Python classes).
No SQLAlchemy — documents are stored as dicts in Motor collections.

Collections:
  - users          : personal info + financial profile merged into one document
  - goals          : goal documents linked by user_id
  - chat_history   : chat messages per user session
"""

from datetime import datetime


def build_user_document(profile_input: dict, user_id: str) -> dict:
    """Build a MongoDB user document from FinancialProfileInput data."""
    return {
        "_id": user_id,
        "name": profile_input.get("name"),
        "age": profile_input.get("age"),
        "occupation": profile_input.get("occupation"),
        "location": profile_input.get("location"),
        "marital_status": profile_input.get("marital_status"),
        "income": {
            "monthly_income": profile_input.get("monthly_income", 0),
        },
        "expenses": {
            "housing": profile_input.get("housing_expense", 0),
            "food": profile_input.get("food_expense", 0),
            "transport": profile_input.get("transport_expense", 0),
            "utilities": profile_input.get("utilities_expense", 0),
            "entertainment": profile_input.get("entertainment_expense", 0),
            "other": profile_input.get("other_expense", 0),
            "loan_emi": profile_input.get("monthly_loan_emi", 0),
        },
        "assets": {
            "savings": profile_input.get("current_savings", 0),
            "stocks": profile_input.get("stocks", 0),
            "mutual_funds": profile_input.get("mutual_funds", 0),
            "gold": profile_input.get("gold", 0),
            "crypto": profile_input.get("crypto", 0),
            "real_estate": profile_input.get("real_estate", 0),
        },
        "liabilities": {
            "total_loans": profile_input.get("total_loans", 0),
            "credit_card_debt": profile_input.get("credit_card_debt", 0),
        },
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }


def build_goal_document(goal: dict, user_id: str) -> dict:
    return {
        "user_id": user_id,
        "goal_type": goal.get("goal_type"),
        "target_amount": goal.get("target_amount", 0),
        "time_horizon_years": goal.get("time_horizon_years", 1),
        "current_savings_for_goal": goal.get("current_savings_for_goal", 0),
        "monthly_investment": goal.get("monthly_investment", 0),
        "priority": goal.get("priority", "Medium"),
        "created_at": datetime.utcnow().isoformat(),
    }


def build_chat_document(user_id: str, user_message: str, ai_response: str) -> dict:
    return {
        "user_id": user_id,
        "user_message": user_message,
        "ai_response": ai_response,
        "timestamp": datetime.utcnow().isoformat(),
    }
