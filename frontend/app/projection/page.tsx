'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OLIVE = '#A35E47';
const DEEP  = '#000000';
const SAGE  = '#B57A68';
const BG    = '#FAFAFA';
const CARD  = '#FFFFFF';
const BORDER= '#9C9A9A';
const SEC   = '#464646';
const MUTED = '#9C9A9A';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 5, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: DEEP }}>Year {label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, marginBottom: 3 }}>{p.name === 'net_worth' ? 'Net Worth' : 'Amount Invested'}: {formatINR(p.value)}</div>)}
    </div>
  );
  return null;
};

export default function ProjectionPage() {
  const router = useRouter();
  const { analysis } = usePerFinStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    usePerFinStore.persist.onFinishHydration(() => setHasHydrated(true));
    setHasHydrated(usePerFinStore.persist.hasHydrated());
  }, []);

  useEffect(() => { 
    if (hasHydrated && !analysis) router.push('/input'); 
  }, [analysis, hasHydrated, router]);
  
  if (!hasHydrated || !analysis) return null;

  const allData = analysis.projections;
  const milestones = [
    { year: 2025, val: allData[0]?.net_worth },
    { year: 2027, val: allData[2]?.net_worth },
    { year: 2030, val: allData[5]?.net_worth },
    { year: 2035, val: allData[10]?.net_worth },
    { year: 2040, val: allData[15]?.net_worth },
  ];

  const card = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6 } as const;
  const secLabel = { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: MUTED, marginBottom: 16 };

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingTop: 76 }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: DEEP, letterSpacing: '-0.02em', marginBottom: 3 }}>
            Wealth <span style={{ color: OLIVE }}>Projection</span>
          </h1>
          <p style={{ color: MUTED, fontSize: 13 }}>Projected net worth growth from 2025 to 2040 at 12% p.a. returns</p>
        </div>

        {/* Chart */}
        <div style={{ ...card, padding: 22, marginBottom: 16 }}>
          <p style={secLabel}>Net Worth Growth (2025 – 2040)</p>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={allData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={OLIVE} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={OLIVE} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={SAGE}  stopOpacity={0.18} />
                  <stop offset="95%" stopColor={SAGE}  stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(190,200,163,0.5)" />
              <XAxis dataKey="year" stroke={MUTED} fontSize={11} tickLine={false} />
              <YAxis stroke={MUTED} fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => formatINR(v)} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: SEC, paddingTop: 10 }} />
              <Area type="monotone" dataKey="net_worth" name="net_worth" stroke={OLIVE} strokeWidth={2} fill="url(#nwGrad)" dot={false} activeDot={{ r: 3, fill: OLIVE }} />
              <Area type="monotone" dataKey="invested" name="invested" stroke={SAGE} strokeWidth={1.5} fill="url(#invGrad)" dot={false} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestones */}
        <div style={{ ...card, padding: 22 }}>
          <p style={secLabel}>Milestone Snapshot</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            {milestones.map(m => (
              <div key={m.year} style={{ textAlign: 'center', padding: '16px 10px', background: BG, borderRadius: 5, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 5, fontWeight: 600, letterSpacing: '0.07em' }}>YEAR {m.year}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: OLIVE }}>{formatINR(m.val ?? 0)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 5, background: 'rgba(99,107,47,0.06)', border: `1px solid ${BORDER}`, fontSize: 12, color: SEC, lineHeight: 1.6 }}>
            <strong style={{ color: OLIVE }}>Assumption:</strong> 12% annual return · 70% of monthly surplus invested · Existing assets grow at 12%
          </div>
        </div>
      </div>
    </div>
  );
}
