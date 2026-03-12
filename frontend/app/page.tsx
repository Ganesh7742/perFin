'use client';
import Link from 'next/link';
import { TrendingUp, Brain, Target, BarChart3, MessageCircle, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';

const features = [
  { icon: <Shield size={22} />, title: 'Health Score', desc: 'Get a comprehensive 0-100 score based on savings, debt, emergency fund & investments.' },
  { icon: <BarChart3 size={22} />, title: 'Wealth Projection', desc: 'See your net worth grow year-by-year up to 2040 with interactive charts.' },
  { icon: <Target size={22} />, title: 'Goal Planning', desc: 'Calculate exact monthly SIP needed to hit every financial goal on time.' },
  { icon: <MessageCircle size={22} />, title: 'AI Advisor', desc: 'Chat with your personal AI financial advisor powered by Google Gemini.' },
];

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)',
          bottom: '20%', right: '15%', pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32,
          padding: '6px 16px', borderRadius: 100,
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
        }}>
          <Sparkles size={13} color="#818cf8" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', letterSpacing: '0.05em' }}>
            AI-POWERED FINANCIAL INTELLIGENCE
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900, textAlign: 'center',
          lineHeight: 1.1, marginBottom: 24, maxWidth: 800,
        }}>
          Your Personal{' '}
          <span className="gradient-text">Finance Copilot</span>
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--text-secondary)', textAlign: 'center',
          maxWidth: 520, lineHeight: 1.8, marginBottom: 48,
        }}>
          Enter your financial data once. Get your health score, wealth projections,
          goal planning, and personalized AI advice — all in one dashboard.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-accent" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, padding: '14px 32px' }}>
              Get Started <ArrowRight size={18} />
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center', opacity: 0.8 }}>
          {[
            { val: '100', label: 'Point Score System' },
            { val: '15+', label: 'Year Projections' },
            { val: 'AI', label: 'Powered Advice' },
          ].map(s => (
            <div key={s.val} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#818cf8' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
          Everything you need
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 60, fontSize: 16 }}>
          A complete financial planning toolkit in one modern interface.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card fade-up" style={{ padding: 28, animationDelay: `${i * 0.1}s` }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, marginBottom: 16,
                background: 'rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#818cf8',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: 600, margin: '0 auto', padding: '60px 40px' }}>
          <Zap size={40} color="#818cf8" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to take control?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
            Takes 2 minutes to fill in your profile. Get instant AI analysis.
          </p>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-accent" style={{ fontSize: 16, padding: '14px 36px' }}>
              Start Your Financial Plan →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        PerFin AI — AI Personal Finance Copilot · Built for Hackathon 2026
      </footer>
    </main>
  );
}
