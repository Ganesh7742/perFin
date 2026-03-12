'use client';
import Link from 'next/link';
import { TrendingUp, BarChart3, Target, MessageCircle, ArrowRight, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const OLIVE = '#A35E47';
const DEEP  = '#000000';
const BG    = '#FAFAFA';
const CARD  = '#FFFFFF';
const BORDER= '#9C9A9A';
const SEC   = '#464646';
const MUTED = '#9C9A9A';
const LIGHT = '#E8DEDC';

const features = [
  { icon: <Shield size={19} />, title: 'Health Score', desc: 'A comprehensive 0–100 score based on savings, debt, emergency fund, and investments.' },
  { icon: <BarChart3 size={19} />, title: 'Wealth Projection', desc: 'See your net worth grow year-by-year up to 2040.' },
  { icon: <Target size={19} />, title: 'Goal Planning', desc: 'Calculate exact monthly SIP needed to hit every financial goal on time.' },
  { icon: <MessageCircle size={19} />, title: 'AI Advisor', desc: 'Chat with your personal AI financial advisor powered by Google Gemini.' },
];

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: BG }}>
      <Navbar />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 28, padding: '4px 14px', borderRadius: 4, background: 'rgba(99,107,47,0.1)', border: `1px solid ${BORDER}` }}>
          <TrendingUp size={11} color={OLIVE} />
          <span style={{ fontSize: 10, fontWeight: 700, color: OLIVE, letterSpacing: '0.09em' }}>AI-POWERED FINANCIAL INTELLIGENCE</span>
        </div>

        <h1 style={{ fontSize: 'clamp(34px, 6vw, 60px)', fontWeight: 600, lineHeight: 1.15, marginBottom: 20, maxWidth: 680, color: DEEP, letterSpacing: '-0.03em' }}>
          Your Personal<br /><span style={{ color: OLIVE }}>Finance Copilot</span>
        </h1>

        <p style={{ fontSize: 16, color: SEC, maxWidth: 460, lineHeight: 1.8, marginBottom: 40 }}>
          Enter your financial data once. Get your health score, wealth projections, goal planning, and personalized AI advice — all in one dashboard.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: OLIVE, color: BG, border: 'none', borderRadius: 5, padding: '11px 26px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Get Started <ArrowRight size={15} />
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 52, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ val: '100', label: 'Point Score System' }, { val: '15+', label: 'Year Projections' }, { val: 'AI', label: 'Powered Advice' }].map(s => (
            <div key={s.val} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: OLIVE }}>{s.val}</div>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 10, color: DEEP, letterSpacing: '-0.02em' }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: SEC, marginBottom: 44, fontSize: 14 }}>A complete financial planning toolkit in one interface.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: 22 }}>
              <div style={{ width: 38, height: 38, borderRadius: 5, marginBottom: 14, background: 'rgba(99,107,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: OLIVE }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: DEEP }}>{f.title}</h3>
              <p style={{ color: SEC, fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: '44px 32px' }}>
          <div style={{ width: 40, height: 40, background: `rgba(197,212,126,0.3)`, border: `1px solid ${LIGHT}`, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <TrendingUp size={20} color={OLIVE} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10, color: DEEP, letterSpacing: '-0.02em' }}>Ready to take control?</h2>
          <p style={{ color: SEC, marginBottom: 26, lineHeight: 1.7, fontSize: 13 }}>Takes 2 minutes to fill in your profile. Get instant AI analysis.</p>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ background: OLIVE, color: BG, border: 'none', borderRadius: 5, padding: '10px 28px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Start Your Financial Plan →
            </button>
          </Link>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '20px', color: MUTED, fontSize: 11, borderTop: `1px solid ${BORDER}` }}>
        PerFin AI — AI Personal Finance Copilot · 2026
      </footer>
    </main>
  );
}
