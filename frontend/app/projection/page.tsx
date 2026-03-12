'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#16161f', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 12, padding: '14px 18px', fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>Year {label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: 4 }}>
            {p.name === 'net_worth' ? 'Net Worth' : 'Amount Invested'}: {formatINR(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProjectionPage() {
  const router = useRouter();
  const { analysis } = usePerFinStore();

  useEffect(() => {
    if (!analysis) router.push('/input');
  }, [analysis, router]);

  if (!analysis) return null;

  const data = analysis.projections.filter(p => p.year % 5 === 0 || p.year === 2025 || p.year === 2026);
  const allData = analysis.projections;

  const milestones = [
    { year: 2025, val: allData[0]?.net_worth },
    { year: 2027, val: allData[2]?.net_worth },
    { year: 2030, val: allData[5]?.net_worth },
    { year: 2035, val: allData[10]?.net_worth },
    { year: 2040, val: allData[15]?.net_worth },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80 }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            Wealth <span className="gradient-text">Projection</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Projected net worth growth from 2025 to 2040 assuming 12% p.a. returns
          </p>
        </div>

        {/* Main Chart */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>
            Net Worth Growth (2025 – 2040)
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={allData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false}
                tickFormatter={v => formatINR(v)}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)', paddingTop: 12 }} />
              <Area
                type="monotone" dataKey="net_worth" name="net_worth" stroke="#6366f1" strokeWidth={2.5}
                fill="url(#netWorthGrad)" dot={false} activeDot={{ r: 5, fill: '#818cf8' }}
              />
              <Area
                type="monotone" dataKey="invested" name="invested" stroke="#10b981" strokeWidth={1.5}
                fill="url(#investedGrad)" dot={false} strokeDasharray="5 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Table */}
        <div className="glass-card" style={{ padding: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>
            Milestone Snapshot
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
            {milestones.map(m => (
              <div key={m.year} style={{
                textAlign: 'center', padding: '20px 12px',
                background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em' }}>
                  YEAR {m.year}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#818cf8' }}>
                  {formatINR(m.val ?? 0)}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 20, padding: '14px 18px', borderRadius: 10,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
          }}>
            💡 <strong style={{ color: '#818cf8' }}>Assumption:</strong> 12% annual return on investments · 70% of monthly surplus invested · Existing assets grow at 12% · SIP continues at current rate
          </div>
        </div>
      </div>
    </div>
  );
}
