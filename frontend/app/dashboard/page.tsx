'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  TrendingUp, Wallet, BarChart2, Target, AlertCircle,
  ArrowUpRight, ArrowDownRight, Shield, Zap, CreditCard, Receipt
} from 'lucide-react';

function ScoreArc({ score }: { score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px' }}>
      <svg viewBox="0 0 160 160" width={160} height={160}>
        <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx="80" cy="80" r="64" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${(score / 100) * 402} 402`}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dasharray 1.5s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 36, fontWeight: 900, color }}>{Math.round(score)}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/ 100</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { analysis, profile } = usePerFinStore();

  useEffect(() => {
    if (!analysis) router.push('/input');
  }, [analysis, router]);

  if (!analysis || !profile) return null;

  const { 
    health_score, monthly_surplus, net_worth, total_assets, total_liabilities, 
    ai_summary, projections, insurance_advice, tax_advice, cibil_advice 
  } = analysis;

  const scoreLabel = health_score.total >= 75 ? 'Excellent' : health_score.total >= 50 ? 'Good' : 'Needs Work';
  const scoreColor = health_score.total >= 75 ? '#10b981' : health_score.total >= 50 ? '#f59e0b' : '#ef4444';
  const projection2030 = projections.find(p => p.year === 2030);
  const projection2035 = projections.find(p => p.year === 2035);

  const metrics = [
    {
      icon: <Wallet size={20} />, label: 'Net Worth', value: formatINR(net_worth),
      sub: net_worth >= 0 ? '▲ On Track' : '▼ Below Zero',
      color: net_worth >= 0 ? '#10b981' : '#ef4444', iconBg: 'rgba(99,102,241,0.15)',
    },
    {
      icon: <TrendingUp size={20} />, label: 'Monthly Surplus', value: formatINR(monthly_surplus),
      sub: `${((monthly_surplus / analysis.monthly_income) * 100).toFixed(1)}% savings rate`,
      color: monthly_surplus >= 0 ? '#10b981' : '#ef4444', iconBg: 'rgba(16,185,129,0.12)',
    },
    {
      icon: <BarChart2 size={20} />, label: 'Total Assets', value: formatINR(total_assets),
      sub: 'Across all instruments', color: '#818cf8', iconBg: 'rgba(129,140,248,0.15)',
    },
    {
      icon: <AlertCircle size={20} />, label: 'Total Liabilities', value: formatINR(total_liabilities),
      sub: `Debt ratio: ${total_liabilities > 0 ? ((total_liabilities / (analysis.monthly_income * 12)) * 100).toFixed(0) : 0}%`,
      color: total_liabilities > 0 ? '#f59e0b' : '#10b981', iconBg: 'rgba(245,158,11,0.12)',
    },
  ];

  const scoreBreakdown = [
    { label: 'Savings Rate', val: health_score.savings_rate_score, max: 25 },
    { label: 'Debt Ratio', val: health_score.debt_ratio_score, max: 25 },
    { label: 'Emergency Fund', val: health_score.emergency_fund_score, max: 25 },
    { label: 'Investment Mix', val: health_score.investment_score, max: 25 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80 }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              Hello, {analysis.name} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Here's your complete financial health report
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/projection"><button className="btn-ghost" style={{ fontSize: 13 }}><BarChart2 size={14} style={{ display: 'inline', marginRight: 6 }} />Projection</button></Link>
            <Link href="/chat"><button className="btn-accent" style={{ fontSize: 13, padding: '8px 18px' }}><ArrowUpRight size={14} style={{ display: 'inline', marginRight: 6 }} />Ask AI</button></Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
          {metrics.map((m, i) => (
            <div key={i} className="glass-card fade-up" style={{ padding: 22, animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                  {m.icon}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: m.color, fontWeight: 600 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Advisor Insight Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>
          {/* Insurance Card */}
          <div className="glass-card fade-up" style={{ padding: 24, borderLeft: '4px solid #818cf8', animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                <Shield size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Insurance Advice</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Life Cover</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatINR(insurance_advice?.life_insurance_cover ?? 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Health Cover</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{insurance_advice?.health_insurance_cover}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
              " {insurance_advice?.advice} "
            </p>
          </div>

          {/* Tax Advisor Card */}
          <div className="glass-card fade-up" style={{ padding: 24, borderLeft: '4px solid #10b981', animationDelay: '0.4s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <Receipt size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Tax Advisor</span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>RECOMMENDED REGIME</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>{tax_advice?.recommended_regime}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.05)', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px dashed rgba(16,185,129,0.3)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Estimated Savings</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{formatINR(tax_advice?.savings ?? 0)}</div>
            </div>
          </div>

          {/* Credit Score Card */}
          <div className="glass-card fade-up" style={{ padding: 24, borderLeft: '4px solid #fbbf24', animationDelay: '0.5s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 8, borderRadius: 8, background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                <CreditCard size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Credit Health</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CIBIL SCORE</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{cibil_advice?.score}</div>
              </div>
              <div className="badge" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: 11 }}>
                {cibil_advice?.status}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'start' }}>
              <Zap size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cibil_advice?.advice}</p>
            </div>
          </div>
        </div>

        {/* Health Score + AI Summary */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>
          {/* Score Card */}
          <div className="glass-card" style={{ flex: '1 1 300px', maxWidth: 400, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Shield size={16} color="#818cf8" />
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Health Score</span>
            </div>
            <ScoreArc score={health_score.total} />
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span className="badge" style={{ background: `${scoreColor}20`, color: scoreColor, fontSize: 13, padding: '6px 18px' }}>
                {scoreLabel}
              </span>
            </div>
            {scoreBreakdown.map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8' }}>{s.val.toFixed(1)}/{s.max}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(s.val / s.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI Summary + Quick projections */}
          <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card" style={{ padding: 28, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div className="pulse-dot" />
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Analysis</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: 14 }}>{ai_summary}</p>
            </div>
            <div className="glass-card" style={{ padding: 24 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Projected Net Worth</p>
              <div className="flex flex-col sm:flex-row gap-5">
                {[{ year: 2030, val: projection2030?.net_worth }, { year: 2035, val: projection2035?.net_worth }].map(p => (
                  <div key={p.year} style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#818cf8' }}>{formatINR(p.val ?? 0)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {p.year}</div>
                    <ArrowUpRight size={14} color="#10b981" style={{ marginTop: 4 }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href="/projection" style={{ textDecoration: 'none' }}>
                  <button className="btn-accent" style={{ width: '100%', fontSize: 13, padding: '10px' }}>
                    View Full Projection Graph →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        {analysis.goals.length > 0 && (
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={16} color="#818cf8" />
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Goal Snapshot</span>
              </div>
              <Link href="/goals"><button className="btn-ghost" style={{ fontSize: 12 }}>View All →</button></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              {analysis.goals.map((g, i) => (
                <div key={i} style={{ padding: 16, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{g.goal_type}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#818cf8', marginBottom: 4 }}>{formatINR(g.target_amount)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{g.time_horizon_years} years</div>
                  <span className={`badge ${g.feasibility === 'Achievable' ? 'badge-success' : 'badge-warning'}`}>
                    {g.feasibility}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
