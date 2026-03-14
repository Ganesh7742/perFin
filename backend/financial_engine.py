from typing import List
from schemas import (
    FinancialProfileInput, GoalInput, GoalResult, ProjectionPoint, 
    HealthScoreBreakdown, InsuranceAdvice, TaxAdvice, CibilAdvice
)


def calculate_monthly_expenses(profile: FinancialProfileInput) -> float:
    return (
        profile.housing_expense
        + profile.food_expense
        + profile.transport_expense
        + profile.utilities_expense
        + profile.entertainment_expense
        + profile.other_expense
        + profile.monthly_loan_emi
    )


def calculate_total_assets(profile: FinancialProfileInput) -> float:
    return (
        profile.current_savings
        + profile.stocks
        + profile.mutual_funds
        + profile.gold
        + profile.crypto
        + profile.real_estate
    )


def calculate_total_liabilities(profile: FinancialProfileInput) -> float:
    return profile.total_loans + profile.credit_card_debt


def calculate_net_worth(profile: FinancialProfileInput) -> float:
    return calculate_total_assets(profile) - calculate_total_liabilities(profile)


def calculate_health_score(profile: FinancialProfileInput) -> HealthScoreBreakdown:
    monthly_expenses = calculate_monthly_expenses(profile)
    monthly_surplus = profile.monthly_income - monthly_expenses
    total_assets = calculate_total_assets(profile)
    total_liabilities = calculate_total_liabilities(profile)

    # 1. Savings Rate Score (25 pts) — ideal >= 30%
    savings_rate = monthly_surplus / profile.monthly_income if profile.monthly_income > 0 else 0
    savings_score = min(25, (savings_rate / 0.30) * 25)

    # 2. Debt Ratio Score (25 pts) — ideal debt/income < 36%
    annual_debt_payments = profile.monthly_loan_emi * 12
    annual_income = profile.monthly_income * 12
    debt_ratio = annual_debt_payments / annual_income if annual_income > 0 else 0
    debt_score = max(0, 25 - (debt_ratio / 0.36) * 25)

    # 3. Emergency Fund Score (25 pts) — ideal >= 6 months expenses
    months_covered = profile.current_savings / monthly_expenses if monthly_expenses > 0 else 0
    emergency_score = min(25, (months_covered / 6) * 25)

    # 4. Investment Diversification Score (25 pts)
    investment_total = profile.stocks + profile.mutual_funds + profile.gold + profile.crypto + profile.real_estate
    diversification_count = sum([
        1 if profile.stocks > 0 else 0,
        1 if profile.mutual_funds > 0 else 0,
        1 if profile.gold > 0 else 0,
        1 if profile.crypto > 0 else 0,
        1 if profile.real_estate > 0 else 0,
    ])
    invest_score = min(25, (diversification_count / 3) * 15 + (min(investment_total, profile.monthly_income * 12) / (profile.monthly_income * 12)) * 10 if profile.monthly_income > 0 else 0)

    total = savings_score + debt_score + emergency_score + invest_score

    return HealthScoreBreakdown(
        savings_rate_score=round(savings_score, 1),
        debt_ratio_score=round(debt_score, 1),
        emergency_fund_score=round(emergency_score, 1),
        investment_score=round(invest_score, 1),
        total=round(total, 1),
    )


def calculate_sip_future_value(monthly_investment: float, annual_rate: float, years: int) -> float:
    """Calculates SIP future value using compound interest formula."""
    if monthly_investment <= 0 or years <= 0:
        return 0
    r = annual_rate / 12  # monthly rate
    n = years * 12       # total months
    return monthly_investment * (((1 + r) ** n - 1) / r) * (1 + r)


def calculate_projections(profile: FinancialProfileInput) -> List[ProjectionPoint]:
    """Projects net worth year by year from current year to 2040."""
    monthly_expenses = calculate_monthly_expenses(profile)
    monthly_surplus = profile.monthly_income - monthly_expenses

    # Investable surplus (after existing EMIs already in expenses)
    monthly_investable = max(0, monthly_surplus * 0.7)  # 70% of surplus invested
    annual_return = 0.12  # 12% assumed annual return

    base_net_worth = calculate_net_worth(profile)
    current_year = 2025
    projections = []

    cumulative_invested = 0
    for i, year in enumerate(range(current_year, 2041)):
        years_elapsed = i
        # Existing assets grow at 12%
        grown_base = base_net_worth * ((1 + annual_return) ** years_elapsed)
        # New SIP contributions
        sip_corpus = calculate_sip_future_value(monthly_investable, annual_return, years_elapsed)
        cumulative_invested = monthly_investable * 12 * years_elapsed
        net_worth = grown_base + sip_corpus

        projections.append(ProjectionPoint(
            year=year,
            net_worth=round(net_worth),
            invested=round(cumulative_invested),
        ))

    return projections


def calculate_goal_result(goal: GoalInput, profile: FinancialProfileInput) -> GoalResult:
    """Calculates required monthly SIP and feasibility for a goal."""
    annual_return = 0.12
    r = annual_return / 12
    n = goal.time_horizon_years * 12

    # Amount still needed after current savings for goal
    remaining = max(0, goal.target_amount - goal.current_savings_for_goal)

    # Required monthly SIP
    if n > 0 and r > 0:
        required_sip = remaining * r / (((1 + r) ** n - 1) * (1 + r))
    else:
        required_sip = remaining / n if n > 0 else remaining

    # Projected corpus from current monthly investment
    projected_corpus = (
        goal.current_savings_for_goal * ((1 + annual_return) ** goal.time_horizon_years)
        + calculate_sip_future_value(goal.monthly_investment, annual_return, goal.time_horizon_years)
    )

    shortfall = max(0, required_sip - goal.monthly_investment)
    feasibility = "Achievable" if goal.monthly_investment >= required_sip else "Needs Adjustment"

    return GoalResult(
        goal_type=goal.goal_type,
        target_amount=goal.target_amount,
        time_horizon_years=goal.time_horizon_years,
        current_savings_for_goal=goal.current_savings_for_goal,
        monthly_investment_needed=round(required_sip),
        current_monthly_investment=goal.monthly_investment,
        feasibility=feasibility,
        shortfall_monthly=round(shortfall),
        projected_corpus=round(projected_corpus),
    )


def calculate_insurance_advice(profile: FinancialProfileInput) -> InsuranceAdvice:
    annual_income = profile.monthly_income * 12
    life_cover = annual_income * 10
    
    if profile.dependents > 0:
        health_cover = "₹10L family floater"
        advice = "Protect dependents and future income risk with a comprehensive family plan."
    else:
        health_cover = "₹5L individual"
        advice = "Ensure basic personal health coverage and income protection."
        
    return InsuranceAdvice(
        life_insurance_cover=float(life_cover),
        health_insurance_cover=health_cover,
        advice=advice
    )


def calculate_new_tax(income: float) -> float:
    tax = 0
    if income > 300000:
        tax += min(income - 300000, 300000) * 0.05
    if income > 600000:
        tax += min(income - 600000, 300000) * 0.10
    if income > 900000:
        tax += min(income - 900000, 300000) * 0.15
    if income > 1200000:
        tax += min(income - 1200000, 300000) * 0.20
    if income > 1500000:
        tax += (income - 1500000) * 0.30
    return tax


def calculate_old_tax(taxable_income: float) -> float:
    tax = 0
    if taxable_income <= 250000:
        return 0
    if taxable_income > 250000:
        tax += min(taxable_income - 250000, 250000) * 0.05
    if taxable_income > 500000:
        tax += min(taxable_income - 500000, 500000) * 0.20
    if taxable_income > 1000000:
        tax += (taxable_income - 1000000) * 0.30
    return tax


def calculate_tax_advice(profile: FinancialProfileInput) -> TaxAdvice:
    annual_income = profile.monthly_income * 12
    old_taxable = max(0, annual_income - profile.total_deductions)
    
    old_tax = calculate_old_tax(old_taxable)
    new_tax_val = calculate_new_tax(annual_income)
    
    if new_tax_val < old_tax:
        regime = "New Tax Regime"
        savings = float(old_tax - new_tax_val)
    else:
        regime = "Old Tax Regime"
        savings = float(new_tax_val - old_tax)
        
    return TaxAdvice(
        old_regime_tax=round(old_tax),
        new_regime_tax=round(new_tax_val),
        recommended_regime=regime,
        savings=round(savings)
    )


def calculate_tax_optimization(profile: FinancialProfileInput) -> "TaxOptimizationResponse":
    from schemas import TaxRecommendation, TaxOptimizationResponse
    
    annual_income = profile.monthly_income * 12
    # Basic logic for March optimization
    recommendations = []
    
    # 1. Section 80C (Limit 1.5L)
    # We assume 'total_deductions' is what they are currently claiming in 80C/D mostly
    # But let's refine: assume 80C is the primary target
    current_80c = profile.total_deductions 
    limit_80c = 150000
    gap_80c = max(0, limit_80c - current_80c)
    
    if gap_80c > 500:
        recommendations.append(TaxRecommendation(
            instrument="ELSS (Tax Saving Mutual Funds)",
            section="80C",
            description="Invest in equity markets with a 3-year lock-in for high returns.",
            current_amount=current_80c,
            recommended_addition=gap_80c * 0.6,
            potential_savings=gap_80c * 0.6 * 0.2 # Assuming 20% slab for simplicity
        ))
        recommendations.append(TaxRecommendation(
            instrument="PPF / VPF",
            section="80C",
            description="Safe, government-backed long term savings with fixed interest.",
            current_amount=current_80c,
            recommended_addition=gap_80c * 0.4,
            potential_savings=gap_80c * 0.4 * 0.2
        ))

    # 2. Section 80D (Health Insurance)
    if profile.existing_insurance < 10000:
        recommendations.append(TaxRecommendation(
            instrument="Comprehensive Health Insurance",
            section="80D",
            description="Protect your family while saving additional tax beyond 80C.",
            current_amount=profile.existing_insurance,
            recommended_addition=25000,
            potential_savings=25000 * 0.2
        ))

    total_add = sum(r.recommended_addition for r in recommendations)
    total_save = sum(r.potential_savings for r in recommendations)
    
    return TaxOptimizationResponse(
        recommendations=recommendations,
        total_additional_investment=round(total_add),
        total_tax_saved=round(total_save)
    )


def calculate_sandbox_simulation(request: "SandboxRequest") -> "SandboxResponse":
    from schemas import SandboxResponse, ProjectionPoint
    
    # Baseline
    baseline = calculate_projections(request.profile)
    
    # Simulated
    sim_profile = request.profile.model_copy(deep=True)
    # Exclude specific goals by setting their investment to 0
    for idx in request.excluded_goal_indices:
        if 0 <= idx < len(sim_profile.goals):
            sim_profile.goals[idx].monthly_investment = 0
            
    simulated = calculate_projections(sim_profile)
    
    # Calculate Impact Analysis (Qualitative placeholder)
    impact = "By sacrificing short-term goals, your long-term wealth trajectory has steepened significantly."
    if simulated[-1].net_worth > baseline[-1].net_worth:
        diff = simulated[-1].net_worth - baseline[-1].net_worth
        impact += f" You could potentially gain an extra ₹{diff:,.0f} by 2040."
        
    return SandboxResponse(
        baseline_projections=baseline,
        simulated_projections=simulated,
        impact_analysis=impact
    )


def calculate_cibil_advice(profile: FinancialProfileInput) -> CibilAdvice:
    score = profile.cibil_score
    utilization = profile.credit_utilization
    
    if score >= 750:
        status = "Excellent"
        advice = "Maintain current credit behaviour. Your credit health is strong."
    elif score >= 700:
        status = "Good"
        advice = "Reduce credit utilization below 30% to further boost your score."
    elif score >= 650:
        status = "Average"
        advice = "Pay EMIs on time and reduce card usage. Avoid new credit inquiries."
    else:
        status = "Poor"
        advice = "Clear outstanding debts and avoid new loans. Focus on timely repayments."
        
    return CibilAdvice(
        score=score,
        status=status,
        advice=advice
    )
