'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Target, CheckCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

export default function GoalsPage() {
  const router = useRouter();
  const { analysis } = usePerFinStore();

  useEffect(() => {
    if (!analysis) router.push('/input');
  }, [analysis, router]);

  if (!analysis) return null;

  const { goals } = analysis;

  if (goals.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80 }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <Target size={48} color="#818cf8" style={{ marginBottom: 20 }} />
          <h2 style={{ marginBottom: 12 }}>No goals yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Add goals in your financial profile to see planning details.</p>
          <button className="btn-accent" onClick={() => router.push('/input')}>Update Profile →</button>
        </div>
      </div>
    );
  }

  const priorityColor = (p: string) => p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#10b981';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80 }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            Goal <span className="gradient-text">Planning</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Exact SIP amounts needed to achieve every financial goal
          </p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-[14px] mb-7">
          {[
            { label: 'Total Goals', val: goals.length, unit: '' },
            { label: 'Achievable', val: goals.filter(g => g.feasibility === 'Achievable').length, unit: '' },
            { label: 'Total Target', val: formatINR(goals.reduce((s, g) => s + g.target_amount, 0)), unit: '' },
            { label: 'Total Monthly SIP', val: formatINR(goals.reduce((s, g) => s + g.monthly_investment_needed, 0)), unit: '/mo' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '18px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#818cf8' }}>{s.val}{s.unit}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Goal Cards */}
        <div className="grid gap-5">
          {goals.map((g, i) => {
            const isAchievable = g.feasibility === 'Achievable';
            const progressPct = Math.min(100, (g.current_savings_for_goal / g.target_amount) * 100);
            return (
              <div key={i} className="glass-card fade-up" style={{ padding: 28, animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isAchievable ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                    }}>
                      {isAchievable ? <CheckCircle size={22} color="#10b981" /> : <AlertTriangle size={22} color="#f59e0b" />}
                    </div>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800 }}>{g.goal_type}</h2>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <span className={`badge ${isAchievable ? 'badge-success' : 'badge-warning'}`}>{g.feasibility}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#818cf8' }}>{formatINR(g.target_amount)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <Calendar size={12} /> {g.time_horizon_years} years
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current progress</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8' }}>{progressPct.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[14px]">
                  {[
                    { icon: <TrendingUp size={14} />, label: 'Required Monthly SIP', val: formatINR(g.monthly_investment_needed), color: '#818cf8' },
                    { icon: <TrendingUp size={14} />, label: 'Current Monthly SIP', val: formatINR(g.current_monthly_investment), color: '#94a3b8' },
                    { icon: <Target size={14} />, label: 'Projected Corpus', val: formatINR(g.projected_corpus), color: '#10b981' },
                    ...(!isAchievable ? [{ icon: <AlertTriangle size={14} />, label: 'Monthly Shortfall', val: `+${formatINR(g.shortfall_monthly)}`, color: '#f59e0b' }] : []),
                  ].map((m, j) => (
                    <div key={j} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: 'var(--text-muted)' }}>
                        {m.icon}
                        <span style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{m.label}</span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
                    </div>
                  ))}
                </div>

                {!isAchievable && (
                  <div style={{
                    marginTop: 16, padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                    fontSize: 13, color: '#f59e0b',
                  }}>
                    💡 Increase monthly SIP by <strong>{formatINR(g.shortfall_monthly)}</strong> to make this goal achievable on time.
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
