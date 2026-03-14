'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePerFinStore } from '@/lib/store';
import { runSandboxSimulation } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { formatINR } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, Trash2, CheckCircle2, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SandboxPage() {
  const { analysis } = usePerFinStore();
  const [excludedIndices, setExcludedIndices] = useState<number[]>([]);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!analysis) return;
    
    async function simulate() {
      setLoading(true);
      try {
        const res = await runSandboxSimulation({
          profile: analysis as any, 
          excluded_goal_indices: excludedIndices
        });
        setSimulationData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    const timeout = setTimeout(simulate, 500);
    return () => clearTimeout(timeout);
  }, [excludedIndices, analysis]);

  if (!analysis) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">Please complete your profile first.</div>;

  const toggleGoal = (idx: number) => {
    setExcludedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-3">
              Dream Sandbox <Sparkles className="text-[#A35E47]" />
            </h1>
            <p className="text-black/50 mt-1">Experiment with "What-If" scenarios. Toggle your goals to see the impact on your long-term wealth.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={18} className="text-[#A35E47]" />
                Active Goals
              </h2>
              <div className="space-y-3">
                {analysis.goals.map((goal: any, idx: number) => {
                  const isExcluded = excludedIndices.includes(idx);
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleGoal(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isExcluded 
                          ? 'bg-black/5 border-transparent opacity-60' 
                          : 'bg-[#A35E47]/5 border-[#A35E47]/20 shadow-sm'
                      }`}
                    >
                      <div>
                        <p className={`font-semibold ${isExcluded ? 'text-black/40' : 'text-black'}`}>{goal.goal_type}</p>
                        <p className="text-xs text-black/50">{formatINR(goal.target_amount)} • {goal.time_horizon_years}y</p>
                      </div>
                      {isExcluded ? <Trash2 size={16} className="text-black/30" /> : <CheckCircle2 size={18} className="text-[#A35E47]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {simulationData && (
              <div className="bg-[#A35E47] text-white rounded-2xl p-6 shadow-lg shadow-[#A35E47]/20">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-80">AI Impact Analysis</h3>
                <p className="text-sm leading-relaxed">{simulationData.impact_analysis}</p>
              </div>
            )}
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5 min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold">Wealth Trajectory Projection</h2>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-black/20" /> Baseline</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#A35E47]" /> Simulated</div>
                </div>
              </div>

              <div className="flex-1 w-full relative">
                {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 font-medium">Simulating scenario...</div>}
                
                {simulationData && (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={simulationData.baseline_projections}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="year" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis 
                        stroke="#999" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                      />
                      <Tooltip 
                        formatter={(val: any) => formatINR(val)}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="net_worth" 
                        stroke="#ccc" 
                        strokeWidth={2} 
                        dot={false} 
                        strokeDasharray="5 5"
                        name="Baseline"
                      />
                      <Line 
                        data={simulationData.simulated_projections}
                        type="monotone" 
                        dataKey="net_worth" 
                        stroke="#A35E47" 
                        strokeWidth={4} 
                        dot={false}
                        name="Simulated"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/5 rounded-xl">
                  <p className="text-xs text-black/50 mb-1">Baseline 2040</p>
                  <p className="text-xl font-bold">{simulationData ? formatINR(simulationData.baseline_projections.slice(-1)[0].net_worth) : '—'}</p>
                </div>
                <div className="p-4 bg-[#A35E47]/10 rounded-xl">
                  <p className="text-xs text-[#A35E47] mb-1">Simulated 2040</p>
                  <p className="text-xl font-bold text-[#A35E47]">{simulationData ? formatINR(simulationData.simulated_projections.slice(-1)[0].net_worth) : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
