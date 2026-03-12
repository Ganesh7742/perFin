import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GoalInput {
  goal_type: string;
  target_amount: number;
  time_horizon_years: number;
  current_savings_for_goal: number;
  monthly_investment: number;
  priority: string;
}

export interface FinancialProfile {
  name: string;
  age: number;
  occupation: string;
  location: string;
  marital_status: string;
  monthly_income: number;
  housing_expense: number;
  food_expense: number;
  transport_expense: number;
  utilities_expense: number;
  entertainment_expense: number;
  other_expense: number;
  current_savings: number;
  stocks: number;
  mutual_funds: number;
  gold: number;
  crypto: number;
  real_estate: number;
  total_loans: number;
  credit_card_debt: number;
  monthly_loan_emi: number;
  // Advisor fields
  dependents: number;
  existing_insurance: number;
  total_deductions: number;
  cibil_score: number;
  credit_utilization: number;
  goals: GoalInput[];
}

export interface HealthScore {
  savings_rate_score: number;
  debt_ratio_score: number;
  emergency_fund_score: number;
  investment_score: number;
  total: number;
}

export interface ProjectionPoint {
  year: number;
  net_worth: number;
  invested: number;
}

export interface GoalResult {
  goal_type: string;
  target_amount: number;
  time_horizon_years: number;
  current_savings_for_goal: number;
  monthly_investment_needed: number;
  current_monthly_investment: number;
  feasibility: string;
  shortfall_monthly: number;
  projected_corpus: number;
}

export interface InsuranceAdvice {
  life_insurance_cover: number;
  health_insurance_cover: string;
  advice: string;
}

export interface TaxAdvice {
  old_regime_tax: number;
  new_regime_tax: number;
  recommended_regime: string;
  savings: number;
}

export interface CibilAdvice {
  score: number;
  status: string;
  advice: string;
}

export interface AnalysisResult {
  user_id: string;
  name: string;
  monthly_income: number;
  monthly_expenses: number;
  monthly_surplus: number;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  health_score: HealthScore;
  projections: ProjectionPoint[];
  goals: GoalResult[];
  ai_summary: string;
  insurance_advice?: InsuranceAdvice;
  tax_advice?: TaxAdvice;
  cibil_advice?: CibilAdvice;
}

interface PerFinStore {
  profile: FinancialProfile | null;
  analysis: AnalysisResult | null;
  setProfile: (p: FinancialProfile) => void;
  setAnalysis: (a: AnalysisResult) => void;
  reset: () => void;
}

export const usePerFinStore = create<PerFinStore>()(
  persist(
    (set) => ({
      profile: null,
      analysis: null,
      setProfile: (p) => set({ profile: p }),
      setAnalysis: (a) => set({ analysis: a }),
      reset: () => set({ profile: null, analysis: null }),
    }),
    {
      name: 'perfin-storage',
    }
  )
);
