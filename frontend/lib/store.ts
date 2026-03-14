import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GoalInput {
  goal_type: string;
  target_amount: number | string;
  time_horizon_years: number | string;
  current_savings_for_goal: number | string;
  monthly_investment: number | string;
  priority: string;
}

export interface FinancialProfile {
  name: string;
  age: number | string;
  occupation: string;
  location: string;
  marital_status: string;
  monthly_income: number | string;
  housing_expense: number | string;
  food_expense: number | string;
  transport_expense: number | string;
  utilities_expense: number | string;
  entertainment_expense: number | string;
  other_expense: number | string;
  current_savings: number | string;
  stocks: number | string;
  mutual_funds: number | string;
  gold: number | string;
  crypto: number | string;
  real_estate: number | string;
  total_loans: number | string;
  credit_card_debt: number | string;
  monthly_loan_emi: number | string;
  // Advisor fields
  dependents: number | string;
  existing_insurance: number | string;
  total_deductions: number | string;
  cibil_score: number | string;
  credit_utilization: number | string;
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
