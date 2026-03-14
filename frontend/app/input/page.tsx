'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore, FinancialProfile, GoalInput } from '@/lib/store';
import { analyzeProfile, uploadFinancialDoc } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { User, DollarSign, PieChart, AlertCircle, Shield, Target, ChevronRight, ChevronLeft, Loader2, Upload, CheckCircle2 } from 'lucide-react';

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
  name: '', age: '', occupation: '', location: '', marital_status: 'Single',
  monthly_income: '',
  housing_expense: '', food_expense: '', transport_expense: '',
  utilities_expense: '', entertainment_expense: '', other_expense: '',
  current_savings: '', stocks: '', mutual_funds: '',
  gold: '', crypto: '', real_estate: '',
  total_loans: '', credit_card_debt: '', monthly_loan_emi: '',
  dependents: '', existing_insurance: '', total_deductions: '',
  cibil_score: 750, credit_utilization: '',
  goals: [{ goal_type: 'Home', target_amount: '', time_horizon_years: '', current_savings_for_goal: '', monthly_investment: '', priority: 'Medium' }],
};

/** Format a raw numeric string into Indian comma notation for display */
function toINRDisplay(val: string | number): string {
  if (val === '' || val === null || val === undefined) return '';
  const raw = String(val).replace(/,/g, '');
  const num = parseFloat(raw);
  if (isNaN(num)) return raw;
  return num.toLocaleString('en-IN');
}

function InputGroup({ label, name, value, onChange, type = 'number', prefix = '₹', placeholder = '0' }: {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; prefix?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isINR = prefix === '₹';

  // Show formatted value when not focused, raw when typing
  const displayValue = isINR && !focused ? toINRDisplay(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isINR) {
      // Strip commas before bubbling up so parent state stays clean
      const stripped = e.target.value.replace(/,/g, '').replace(/[^0-9]/g, '');
      const syntheticEvent = Object.create(e) as React.ChangeEvent<HTMLInputElement>;
      Object.defineProperty(syntheticEvent, 'target', {
        writable: false,
        value: { ...e.target, name, value: stripped },
      });
      onChange(syntheticEvent);
    } else {
      onChange(e);
    }
  };

  return (
    <div>
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MUTED, fontSize: 13 }}>{prefix}</span>}
        <input
          className="input-field"
          type={isINR ? 'text' : type}
          inputMode={isINR ? 'numeric' : undefined}
          name={name}
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          placeholder={placeholder}
          style={{ paddingLeft: prefix ? 26 : 14 }}
        />
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
  const { profile: storedProfile, setProfile, setAnalysis } = usePerFinStore();
  const [step, setStep] = useState(0);
  const [profile, setLocalProfile] = useState<FinancialProfile>(defaultProfile);

  useEffect(() => {
    if (storedProfile) {
      setLocalProfile(storedProfile);
    }
  }, [storedProfile]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setError('');
    setSyncSuccess(false);

    try {
      const data = await uploadFinancialDoc(file);
      
      setLocalProfile(prev => ({
        ...prev,
        ...data,
        name: data.name || prev.name,
      }));
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    } catch (err: any) {
      console.error("Extraction failed", err);
      if (err.response?.status === 429) {
        setError("API Limit reached. If you're using a digital PDF, try again now (we'll use Groq). If it's a photo, please wait 1 minute.");
      } else {
        setError("AI was unable to read the document. Please ensure it's a clear PDF or image.");
      }
    } finally {
      setExtracting(false);
    }
  };

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // For numbers, we keep them as strings in the local state to allow empty strings and handle leading zeros naturally
    setLocalProfile(prev => ({ ...prev, [name]: type === 'number' ? value : value }));
  };

  const updateGoal = (i: number, field: keyof GoalInput, value: string | number) => {
    // Strip commas so numeric state stays clean
    const cleaned = typeof value === 'string' ? value.replace(/,/g, '').replace(/[^0-9]/g, '') : value;
    setLocalProfile(prev => {
      const goals = [...prev.goals];
      goals[i] = { ...goals[i], [field]: cleaned };
      return { ...prev, goals };
    });
  };

  const addGoal = () => setLocalProfile(prev => ({
    ...prev,
    goals: [...prev.goals, { goal_type: 'Retirement', target_amount: '', time_horizon_years: '', current_savings_for_goal: '', monthly_investment: '', priority: 'Medium' }],
  }));

  const removeGoal = (i: number) => setLocalProfile(prev => ({ ...prev, goals: prev.goals.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      // Coerce every field: numeric strings (including empty) → number, others stay string
      const toNum = (v: any) => (v === '' || v === null || v === undefined) ? 0 : Number(v);

      const sanitized: any = { ...profile };
      const numericTopFields = [
        'age', 'monthly_income',
        'housing_expense', 'food_expense', 'transport_expense',
        'utilities_expense', 'entertainment_expense', 'other_expense',
        'current_savings', 'stocks', 'mutual_funds', 'gold', 'crypto', 'real_estate',
        'total_loans', 'credit_card_debt', 'monthly_loan_emi',
        'dependents', 'existing_insurance', 'total_deductions',
        'cibil_score', 'credit_utilization',
      ];
      numericTopFields.forEach(k => { sanitized[k] = toNum(sanitized[k]); });

      sanitized.goals = (sanitized.goals as any[]).map((g: any) => ({
        ...g,
        target_amount: toNum(g.target_amount),
        time_horizon_years: toNum(g.time_horizon_years),
        current_savings_for_goal: toNum(g.current_savings_for_goal),
        monthly_investment: toNum(g.monthly_investment),
      }));

      setProfile(sanitized);
      const result = await analyzeProfile(sanitized);
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
        <div style={{ textAlign: 'center', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/profile.png" 
            alt="Profile" 
            style={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              border: `2px solid ${OLIVE}`,
              marginBottom: 16,
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(163,94,71,0.15)'
            }} 
          />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: DEEP, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Build Your <span style={{ color: OLIVE }}>Financial Profile</span>
          </h1>
          <p style={{ color: MUTED, fontSize: 13 }}>Fill in your details · Takes about 2 minutes</p>
        </div>

        {/* Wealth Sync Card */}
        <div className="hover-card" style={{ 
          background: 'rgba(163,94,71,0.04)', 
          border: `1px dashed ${OLIVE}`, 
          borderRadius: 8, 
          padding: '24px', 
          marginBottom: 28, 
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ background: OLIVE, color: BG, padding: 10, borderRadius: '50%' }}>
              {syncSuccess ? <CheckCircle2 size={24} /> : <Upload size={24} />}
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: DEEP, marginBottom: 4 }}>
                {syncSuccess ? 'Wealth Synced Successfully!' : 'Instant Wealth Sync'}
              </h2>
              <p style={{ fontSize: 12, color: SEC, maxWidth: 400, margin: '0 auto' }}>
                Upload your bank statement or salary slip (PDF/Image) and let PerFin AI auto-fill the boring stuff for you.
              </p>
            </div>
            
            <label style={{ 
              marginTop: 8,
              background: OLIVE,
              color: BG,
              padding: '10px 24px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: extracting ? 'not-allowed' : 'pointer',
              opacity: extracting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'transform 0.1s active'
            }}>
              {extracting ? (
                <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Reading Document...</>
              ) : (
                'Upload Financial Document'
              )}
              <input type="file" hidden accept=".pdf,image/*" onChange={handleFileUpload} disabled={extracting} />
            </label>
            
            {syncSuccess && (
              <p style={{ fontSize: 11, color: OLIVE, fontWeight: 700 }}>
                Done! We've updated your assets, income, and EMIs.
              </p>
            )}
          </div>
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
        <div className="hover-card" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: 28, marginBottom: 18 }}>

          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><InputGroup label="Full Name" name="name" value={profile.name} onChange={update} type="text" prefix="" placeholder="Name" /></div>
              <InputGroup label="Age" name="age" value={profile.age} onChange={update} prefix="" placeholder="Age" />
              <InputGroup label="Occupation" name="occupation" value={profile.occupation} onChange={update} type="text" prefix="" placeholder="Occupation" />
              <InputGroup label="City" name="location" value={profile.location} onChange={update} type="text" prefix="" placeholder="City" />
              <SelectGroup label="Marital Status" name="marital_status" value={profile.marital_status} onChange={update} options={['Single', 'Married', 'Divorced', 'Widowed']} />
              <InputGroup label="Dependents" name="dependents" value={profile.dependents} onChange={update} prefix="" placeholder="Number of dependents" />
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><p style={secHead}>Monthly Income</p><InputGroup label="Monthly Take-Home Income" name="monthly_income" value={profile.monthly_income} onChange={update} placeholder="Amount" /></div>
              <div className="md:col-span-2"><p style={secHead}>Monthly Expenses</p></div>
               <InputGroup label="Housing / Rent" name="housing_expense" value={profile.housing_expense} onChange={update} placeholder="Amount" />
              <InputGroup label="Food & Groceries" name="food_expense" value={profile.food_expense} onChange={update} placeholder="Amount" />
              <InputGroup label="Transport" name="transport_expense" value={profile.transport_expense} onChange={update} placeholder="Amount" />
              <InputGroup label="Utilities" name="utilities_expense" value={profile.utilities_expense} onChange={update} placeholder="Amount" />
              <InputGroup label="Entertainment" name="entertainment_expense" value={profile.entertainment_expense} onChange={update} placeholder="Amount" />
              <InputGroup label="Other Expenses" name="other_expense" value={profile.other_expense} onChange={update} placeholder="Amount" />
              <div className="md:col-span-2"><InputGroup label="Annual Tax Deductions (80C etc.)" name="total_deductions" value={profile.total_deductions} onChange={update} placeholder="Amount" /></div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Cash / Savings (FD, Bank)" name="current_savings" value={profile.current_savings} onChange={update} placeholder="Amount" />
              <InputGroup label="Stocks (Direct Equity)" name="stocks" value={profile.stocks} onChange={update} placeholder="Amount" />
              <InputGroup label="Mutual Funds" name="mutual_funds" value={profile.mutual_funds} onChange={update} placeholder="Amount" />
              <InputGroup label="Gold (Physical / Digital)" name="gold" value={profile.gold} onChange={update} placeholder="Amount" />
              <InputGroup label="Crypto" name="crypto" value={profile.crypto} onChange={update} placeholder="Amount" />
              <InputGroup label="Real Estate (Market Value)" name="real_estate" value={profile.real_estate} onChange={update} placeholder="Amount" />
              <div className="md:col-span-2"><InputGroup label="Existing Insurance Cover" name="existing_insurance" value={profile.existing_insurance} onChange={update} placeholder="Amount" /></div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Total Loans Outstanding" name="total_loans" value={profile.total_loans} onChange={update} placeholder="Amount" />
              <InputGroup label="Credit Card Debt" name="credit_card_debt" value={profile.credit_card_debt} onChange={update} placeholder="Amount" />
              <div className="md:col-span-2"><InputGroup label="Monthly EMI (Total)" name="monthly_loan_emi" value={profile.monthly_loan_emi} onChange={update} placeholder="Amount" /></div>
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
                <div key={i} className="hover-card" style={{ marginBottom: 20, padding: 18, borderRadius: 5, background: CARD2, border: `1px solid ${BORDER}` }}>
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
                    <div><label className="input-label">Target Amount (₹)</label><input className="input-field" type="text" inputMode="numeric" value={toINRDisplay(g.target_amount)} onChange={e => updateGoal(i, 'target_amount', e.target.value)} placeholder="Amount" /></div>
                    <div><label className="input-label">Time Horizon (Years)</label><input className="input-field" type="number" value={g.time_horizon_years} onChange={e => updateGoal(i, 'time_horizon_years', e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} placeholder="Years" /></div>
                    <div><label className="input-label">Current Savings for Goal (₹)</label><input className="input-field" type="text" inputMode="numeric" value={toINRDisplay(g.current_savings_for_goal)} onChange={e => updateGoal(i, 'current_savings_for_goal', e.target.value)} placeholder="Amount" /></div>
                    <div><label className="input-label">Monthly Investment (₹)</label><input className="input-field" type="text" inputMode="numeric" value={toINRDisplay(g.monthly_investment)} onChange={e => updateGoal(i, 'monthly_investment', e.target.value)} placeholder="Amount" /></div>
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
