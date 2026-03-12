from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class GoalInput(BaseModel):
    goal_type: str
    target_amount: float
    time_horizon_years: int
    current_savings_for_goal: float = 0
    monthly_investment: float = 0
    priority: str = "Medium"


class FinancialProfileInput(BaseModel):
    # Personal Info
    name: str
    age: int
    occupation: str
    location: str
    marital_status: str

    # Income & Expenses
    monthly_income: float
    housing_expense: float = 0
    food_expense: float = 0
    transport_expense: float = 0
    utilities_expense: float = 0
    entertainment_expense: float = 0
    other_expense: float = 0

    # Assets
    current_savings: float = 0
    stocks: float = 0
    mutual_funds: float = 0
    gold: float = 0
    crypto: float = 0
    real_estate: float = 0

    # Liabilities
    total_loans: float = 0
    credit_card_debt: float = 0
    monthly_loan_emi: float = 0

    # Advisor Specific Inputs
    dependents: int = 0
    existing_insurance: float = 0
    total_deductions: float = 0
    cibil_score: int = 700
    credit_utilization: float = 0 # percentage
    
    # Goals
    goals: List[GoalInput] = []


class ChatMessage(BaseModel):
    message: str
    profile: FinancialProfileInput


class GoalResult(BaseModel):
    goal_type: str
    target_amount: float
    time_horizon_years: int
    current_savings_for_goal: float
    monthly_investment_needed: float
    current_monthly_investment: float
    feasibility: str
    shortfall_monthly: float
    projected_corpus: float


class ProjectionPoint(BaseModel):
    year: int
    net_worth: float
    invested: float


class HealthScoreBreakdown(BaseModel):
    savings_rate_score: float
    debt_ratio_score: float
    emergency_fund_score: float
    investment_score: float
    total: float


class InsuranceAdvice(BaseModel):
    life_insurance_cover: float
    health_insurance_cover: str
    advice: str


class TaxAdvice(BaseModel):
    old_regime_tax: float
    new_regime_tax: float
    recommended_regime: str
    savings: float


class CibilAdvice(BaseModel):
    score: int
    status: str
    advice: str


class AnalysisResponse(BaseModel):
    user_id: str
    name: str
    monthly_income: float
    monthly_expenses: float
    monthly_surplus: float
    total_assets: float
    total_liabilities: float
    net_worth: float
    health_score: HealthScoreBreakdown
    projections: List[ProjectionPoint]
    goals: List[GoalResult]
    ai_summary: str
    insurance_advice: Optional[InsuranceAdvice] = None
    tax_advice: Optional[TaxAdvice] = None
    cibil_advice: Optional[CibilAdvice] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
