'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { BookOpen, Lightbulb, ShieldCheck, PieChart, ArrowRight, BookMarked, GraduationCap } from 'lucide-react';

const OLIVE = '#A35E47';
const DEEP  = '#000000';
const BG    = '#FAFAFA';
const CARD  = '#FFFFFF';
const BORDER= '#9C9A9A';
const SEC   = '#464646';
const MUTED = '#9C9A9A';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('Basics');

  const categories = [
    { name: 'Basics', icon: Lightbulb },
    { name: 'Investing', icon: PieChart },
    { name: 'Taxation', icon: ShieldCheck },
    { name: 'Planning', icon: BookOpen },
  ];

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingTop: 76 }}>
      <Navbar />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 40, background: DEEP, borderRadius: 12, padding: '48px 40px', color: BG, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <GraduationCap size={20} color={OLIVE} />
              <span style={{ fontSize: 13, fontWeight: 600, color: OLIVE, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Financial Literacy</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>Master Your Money Journey</h1>
            <p style={{ fontSize: 16, maxWidth: 500, opacity: 0.8, lineHeight: 1.6 }}>
              Comprehensive guides and insights designed to help you build wealth, optimize taxes, and secure your financial future.
            </p>
          </div>
          <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1 }}>
             <BookMarked size={200} color={BG} />
          </div>
        </div>

        {/* Categories / Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === cat.name ? DEEP : CARD,
                color: activeTab === cat.name ? BG : SEC,
                border: activeTab === cat.name ? `1px solid ${DEEP}` : `1px solid ${BORDER}`,
              }}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content Placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24, marginBottom: 60 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(163,94,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color={OLIVE} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: DEEP }}>Coming Soon: {activeTab} Guide #{i}</h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.5 }}>
                We're crafting expert content to simplify {activeTab.toLowerCase()} concepts. Stay tuned for deep dives and actionable tips.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: OLIVE, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Notify Me <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        button:hover {
          border-color: ${OLIVE} !important;
        }
      `}</style>
    </div>
  );
}
