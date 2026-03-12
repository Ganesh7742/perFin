'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Target, CheckCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const OLIVE = '#A35E47';
const DEEP  = '#000000';
const SAGE  = '#B57A68';
const BG    = '#FAFAFA';
const CARD  = '#FFFFFF';
const BORDER= '#9C9A9A';
const SEC   = '#464646';
const MUTED = '#9C9A9A';

export default function GoalsPage() {
  const router = useRouter();
  const { analysis } = usePerFinStore();
  useEffect(() => { if (!analysis) router.push('/input'); }, [analysis, router]);
  if (!analysis) return null;

  const { goals } = analysis;
  const card = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6 } as const;
  const secLabel = { fontSize: 10, fontWeight: 700 as const, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: MUTED };

  if (goals.length === 0) return (
    <div style={{ minHeight: '100vh', background: BG, paddingTop: 76 }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 44, height: 44, borderRadius: 6, background: 'rgba(99,107,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Target size={22} color={OLIVE} />
        </div>
        <h2 style={{ marginBottom: 8, color: DEEP, fontWeight: 600 }}>No goals yet</h2>
        <p style={{ color: SEC, marginBottom: 22, fontSize: 13 }}>Add goals in your financial profile to see planning details.</p>
        <button className="btn-accent" onClick={() => router.push('/input')}>Update Profile →</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingTop: 76 }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: DEEP, letterSpacing: '-0.02em', marginBottom: 3 }}>Goal <span style={{ color: OLIVE }}>Planning</span></h1>
          <p style={{ color: MUTED, fontSize: 13 }}>Exact SIP amounts needed to achieve every financial goal</p>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total Goals', val: goals.length },
            { label: 'Achievable', val: goals.filter(g => g.feasibility === 'Achievable').length },
            { label: 'Total Target', val: formatINR(goals.reduce((s, g) => s + g.target_amount, 0)) },
            { label: 'Monthly SIP', val: formatINR(goals.reduce((s, g) => s + g.monthly_investment_needed, 0)) },
          ].map((s, i) => (
            <div key={i} style={{ ...card, padding: '14px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: OLIVE }}>{s.val}</div>
              <div style={{ ...secLabel, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Goal Cards */}
        <div style={{ display: 'grid', gap: 14 }}>
          {goals.map((g, i) => {
            const ok = g.feasibility === 'Achievable';
            const pct = Math.min(100, (g.current_savings_for_goal / g.target_amount) * 100);
            return (
              <div key={i} style={{ ...card, padding: 22, borderLeft: `3px solid ${ok ? OLIVE : SAGE}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ok ? 'rgba(99,107,47,0.1)' : 'rgba(143,158,88,0.14)' }}>
                      {ok ? <CheckCircle size={19} color={OLIVE} /> : <AlertTriangle size={19} color={SAGE} />}
                    </div>
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: DEEP }}>{g.goal_type}</h2>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginTop: 3, display: 'inline-block', background: ok ? 'rgba(99,107,47,0.1)' : 'rgba(143,158,88,0.15)', color: ok ? '#3A4A18' : '#464646' }}>{g.feasibility}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: OLIVE }}>{formatINR(g.target_amount)}</div>
                    <div style={{ fontSize: 11, color: MUTED, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 3 }}><Calendar size={10} /> {g.time_horizon_years} years</div>
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: MUTED }}>Current progress</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: OLIVE }}>{pct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {[
                    { icon: <TrendingUp size={12} />, label: 'Required Monthly SIP', val: formatINR(g.monthly_investment_needed), color: OLIVE },
                    { icon: <TrendingUp size={12} />, label: 'Current Monthly SIP', val: formatINR(g.current_monthly_investment), color: SEC },
                    { icon: <Target size={12} />, label: 'Projected Corpus', val: formatINR(g.projected_corpus), color: OLIVE },
                    ...(!ok ? [{ icon: <AlertTriangle size={12} />, label: 'Monthly Shortfall', val: `+${formatINR(g.shortfall_monthly)}`, color: SAGE }] : []),
                  ].map((m, j) => (
                    <div key={j} style={{ background: BG, borderRadius: 5, padding: '11px', border: `1px solid ${BORDER}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, color: MUTED }}>{m.icon}<span style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.label}</span></div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: m.color }}>{m.val}</div>
                    </div>
                  ))}
                </div>

                {!ok && (
                  <div style={{ marginTop: 14, padding: '9px 12px', borderRadius: 5, background: 'rgba(143,158,88,0.08)', border: `1px solid rgba(143,158,88,0.3)`, fontSize: 12, color: '#464646' }}>
                    Increase monthly SIP by <strong>{formatINR(g.shortfall_monthly)}</strong> to make this goal achievable on time.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
