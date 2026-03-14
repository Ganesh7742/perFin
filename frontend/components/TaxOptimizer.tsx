'use client';

import React, { useEffect, useState } from 'react';
import { getTaxOptimization } from '@/lib/api';
import { IndianRupee, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

interface Recommendation {
  instrument: string;
  section: string;
  description: string;
  current_amount: number;
  recommended_addition: number;
  potential_savings: number;
}

export default function TaxOptimizer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await getTaxOptimization();
        setData(res);
      } catch (err) {
        setError('Complete your profile to see tax savings.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-center text-white/50">Calculating tax savings...</div>;
  if (error) return <div className="p-6 text-center text-white/30 text-sm italic">{error}</div>;

  return (
    <div className="bg-[#1e231f] border border-[#2a302b] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="text-[#89a48e]" size={24} />
            March Tax Savior
          </h2>
          <p className="text-white/50 text-sm mt-1">Smart recommendations to hit your ₹50k savings goal.</p>
        </div>
        <div className="text-right">
          <p className="text-[#89a48e] text-2xl font-bold">₹{data.total_tax_saved.toLocaleString()}</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Potential Savings</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.recommendations.map((rec: Recommendation, i: number) => (
          <div key={i} className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-[#89a48e]/30 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] bg-[#89a48e]/20 text-[#89a48e] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest leading-none">
                  Section {rec.section}
                </span>
                <h3 className="text-white font-medium mt-1.5 group-hover:text-[#89a48e] transition-colors">{rec.instrument}</h3>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">+ ₹{rec.recommended_addition.toLocaleString()}</p>
                <p className="text-[10px] text-white/40">Invest this much</p>
              </div>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">{rec.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#89a48e]/10 border border-[#89a48e]/20 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-[#89a48e] shrink-0" size={18} />
        <p className="text-sm text-[#89a48e] leading-snug">
          {data.march_deadline_alert}
        </p>
      </div>

      <button className="w-full mt-6 py-3 bg-[#89a48e] hover:bg-[#7a937f] text-black font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
        <TrendingUp size={18} />
        Download Action Plan (PDF)
      </button>
    </div>
  );
}
