'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore, FinancialProfile, GoalInput } from '@/lib/store';
import { analyzeProfile } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { User, DollarSign, PieChart, AlertCircle, Shield, Target, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const OLIVE = '#A35E47';
const DEEP  = '#000000';
const BG    = '#FAFAFA';
const CARD  = '#FFFFFF';
const CARD2 = '#F0F0F0';
const BORDER= '#9C9A9A';
const SEC   = '#464646';
const MUTED = '#9C9A9A';

const STEPS = ['Personal Info', 'Income & Expenses', 'Assets', 'Liabilities', 'Credit & Tax', 'Goals'];

const defaultProfile: FinancialProfile = {
  name: '', age: 28, occupation: '', location: '', marital_status: 'Single',
  monthly_income: 80000,
  housing_expense: 12000, food_expense: 8000, transport_expense: 4000,
  utilities_expense: 2000, entertainment_expense: 3000, other_expense: 2000,
  current_savings: 300000, stocks: 100000, mutual_funds: 150000,
  gold: 50000, crypto: 0, real_estate: 0,
  total_loans: 0, credit_card_debt: 0, monthly_loan_emi: 0,
  dependents: 0, existing_insurance: 0, total_deductions: 50000,
  cibil_score: 750, credit_utilization: 20,
  goals: [{ goal_type: 'House', target_amount: 5000000, time_horizon_years: 8, current_savings_for_goal: 0, monthly_investment: 10000, priority: 'High' }],
};

function InputGroup({ label, name, value, onChange, type = 'number', prefix = '₹', placeholder = '0' }: {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; prefix?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 13 }}>{prefix}</span>}
        <input className="input-field" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={{ paddingLeft: prefix ? 26 : 14 }} />
      </div>
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, options }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[];
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <select className="input-field" name={name} value={value} onChange={onChange}
        style={{ background: BG, color: DEEP }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function InputPage() {
  const router = useRouter();
  const { setProfile, setAnalysis } = usePerFinStore();
  const [step, setStep] = useState(0);
  const [profile, setLocalProfile] = useState<FinancialProfile>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({ ...prev, [name]: isNaN(Number(value)) ? value : (e.target.type === 'number' ? Number(value) : value) }));
  };

  const updateGoal = (i: number, field: keyof GoalInput, value: string | number) => {
    setLocalProfile(prev => {
      const goals = [...prev.goals];
      goals[i] = { ...goals[i], [field]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value };
      return { ...prev, goals };
    });
  };

  const addGoal = () => setLocalProfile(prev => ({
    ...prev,
    goals: [...prev.goals, { goal_type: 'Retirement', target_amount: 10000000, time_horizon_years: 20, current_savings_for_goal: 0, monthly_investment: 5000, priority: 'Medium' }],
  }));

  const removeGoal = (i: number) => setLocalProfile(prev => ({ ...prev, goals: prev.goals.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      setProfile(profile);
      const result = await analyzeProfile(profile);
      setAnalysis(result);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend. Make sure FastAPI is running on port 8000.');
    } finally { setLoading(false); }
  };

  const stepIcons = [<User size={13} />, <DollarSign size={13} />, <PieChart size={13} />, <AlertCircle size={13} />, <Shield size={13} />, <Target size={13} />];
  const secHead = { fontWeight: 600, marginBottom: 14, color: MUTED, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const };

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingTop: 76 }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: DEEP, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Build Your <span style={{ color: OLIVE }}>Financial Profile</span>
          </h1>
          <p style={{ color: MUTED, fontSize: 13 }}>Fill in your details · Takes about 2 minutes</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 4, border: 'none',
              cursor: 'pointer', fontSize: 11, fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              background: i === step ? OLIVE : i < step ? 'rgba(99,107,47,0.18)' : CARD,
              color: i === step ? BG : i < step ? OLIVE : MUTED,
            }}>
              {stepIcons[i]} {s}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 24 }}>
          <div className="progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* Card */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: 28, marginBottom: 18 }}>

          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><InputGroup label="Full Name" name="name" value={profile.name} onChange={update} type="text" prefix="" placeholder="Ganesh Kumar" /></div>
              <InputGroup label="Age" name="age" value={profile.age} onChange={update} prefix="" placeholder="28" />
              <InputGroup label="Occupation" name="occupation" value={profile.occupation} onChange={update} type="text" prefix="" placeholder="Software Engineer" />
              <InputGroup label="City" name="location" value={profile.location} onChange={update} type="text" prefix="" placeholder="Bangalore" />
              <SelectGroup label="Marital Status" name="marital_status" value={profile.marital_status} onChange={update} options={['Single', 'Married', 'Divorced', 'Widowed']} />
              <InputGroup label="Dependents" name="dependents" value={profile.dependents} onChange={update} prefix="" placeholder="0" />
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><p style={secHead}>Monthly Income</p><InputGroup label="Monthly Take-Home Income" name="monthly_income" value={profile.monthly_income} onChange={update} /></div>
              <div className="md:col-span-2"><p style={secHead}>Monthly Expenses</p></div>
              <InputGroup label="Housing / Rent" name="housing_expense" value={profile.housing_expense} onChange={update} />
              <InputGroup label="Food & Groceries" name="food_expense" value={profile.food_expense} onChange={update} />
              <InputGroup label="Transport" name="transport_expense" value={profile.transport_expense} onChange={update} />
              <InputGroup label="Utilities" name="utilities_expense" value={profile.utilities_expense} onChange={update} />
              <InputGroup label="Entertainment" name="entertainment_expense" value={profile.entertainment_expense} onChange={update} />
              <InputGroup label="Other Expenses" name="other_expense" value={profile.other_expense} onChange={update} />
              <div className="md:col-span-2"><InputGroup label="Annual Tax Deductions (80C etc.)" name="total_deductions" value={profile.total_deductions} onChange={update} /></div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Cash / Savings (FD, Bank)" name="current_savings" value={profile.current_savings} onChange={update} />
              <InputGroup label="Stocks (Direct Equity)" name="stocks" value={profile.stocks} onChange={update} />
              <InputGroup label="Mutual Funds" name="mutual_funds" value={profile.mutual_funds} onChange={update} />
              <InputGroup label="Gold (Physical / Digital)" name="gold" value={profile.gold} onChange={update} />
              <InputGroup label="Crypto" name="crypto" value={profile.crypto} onChange={update} />
              <InputGroup label="Real Estate (Market Value)" name="real_estate" value={profile.real_estate} onChange={update} />
              <div className="md:col-span-2"><InputGroup label="Existing Insurance Cover" name="existing_insurance" value={profile.existing_insurance} onChange={update} /></div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Total Loans Outstanding" name="total_loans" value={profile.total_loans} onChange={update} />
              <InputGroup label="Credit Card Debt" name="credit_card_debt" value={profile.credit_card_debt} onChange={update} />
              <div className="md:col-span-2"><InputGroup label="Monthly EMI (Total)" name="monthly_loan_emi" value={profile.monthly_loan_emi} onChange={update} /></div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><p style={secHead}>Credit Health</p></div>
              <InputGroup label="CIBIL Score" name="cibil_score" value={profile.cibil_score} onChange={update} prefix="" placeholder="750" />
              <InputGroup label="Credit Utilization (%)" name="credit_utilization" value={profile.credit_utilization} onChange={update} prefix="%" placeholder="30" />
            </div>
          )}

          {step === 5 && (
            <div>
              {profile.goals.map((g, i) => (
                <div key={i} style={{ marginBottom: 20, padding: 18, borderRadius: 5, background: CARD2, border: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontWeight: 600, color: OLIVE, fontSize: 13 }}>Goal #{i + 1}</span>
                    {profile.goals.length > 1 && (
                      <button onClick={() => removeGoal(i)} style={{ background: 'none', border: 'none', color: '#8B3A2A', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Goal Type</label>
                      <select className="input-field" value={g.goal_type} onChange={e => updateGoal(i, 'goal_type', e.target.value)} style={{ background: BG, color: DEEP }}>
                        {['House', 'Car', 'Retirement', 'Education', 'Travel', 'Wedding', 'Emergency Fund', 'Business', 'Other'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Priority</label>
                      <select className="input-field" value={g.priority} onChange={e => updateGoal(i, 'priority', e.target.value)} style={{ background: BG, color: DEEP }}>
                        {['High', 'Medium', 'Low'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div><label className="input-label">Target Amount (₹)</label><input className="input-field" type="number" value={g.target_amount} onChange={e => updateGoal(i, 'target_amount', e.target.value)} /></div>
                    <div><label className="input-label">Time Horizon (Years)</label><input className="input-field" type="number" value={g.time_horizon_years} onChange={e => updateGoal(i, 'time_horizon_years', e.target.value)} /></div>
                    <div><label className="input-label">Current Savings for Goal (₹)</label><input className="input-field" type="number" value={g.current_savings_for_goal} onChange={e => updateGoal(i, 'current_savings_for_goal', e.target.value)} /></div>
                    <div><label className="input-label">Monthly Investment (₹)</label><input className="input-field" type="number" value={g.monthly_investment} onChange={e => updateGoal(i, 'monthly_investment', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <button className="btn-ghost" onClick={addGoal} style={{ width: '100%', borderStyle: 'dashed' }}>+ Add Another Goal</button>
            </div>
          )}
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 5, background: 'rgba(139,58,42,0.08)', border: '1px solid rgba(139,58,42,0.25)', color: '#8B3A2A', fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <button className="btn-ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ChevronLeft size={14} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn-accent" onClick={() => setStep(s => s + 1)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button className="btn-accent" onClick={handleSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 210, justifyContent: 'center' }}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : 'Generate Financial Plan →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
