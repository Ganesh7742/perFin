'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  TrendingUp, BarChart3, Target, MessageCircle, ArrowRight, Shield, Zap, Info, 
  Upload, Cpu, Map, Lock, EyeOff, Trash2, Database, ChevronRight, Check, User
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../lib/auth-store';

// --- DESIGN TOKENS ---
const OLIVE = '#A35E47'; 
const GOLD  = '#D4AF37'; 
const DEEP  = '#050505'; 
const GLASS_BG = 'rgba(255, 255, 255, 0.04)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.1)';

const problemCards = [
  { title: "You earn well. But where does it go?", desc: "Lifestyle creep is real. You're saving less than you should, but you can't pinpoint exactly where the leak is.", icon: "₹" },
  { title: "Your CIBIL dropped. You found out too late.", desc: "A forgotten ₹500 subscription or high credit utilization quietly tanked your score without warning.", icon: "↘" },
  { title: "Tax season hits. You're scrambling.", desc: "You're missing out on 80C, 80D, and HRA optimizations because nobody told you to structure it in advance.", icon: "📅" },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <main className="landing-container">
      <Navbar />

      <div className="aura-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="content-wrapper">
        
        {/* --- HERO SECTION --- */}
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-text-side">
              <div className="badge">
                <span className="dot"></span> Built for Indian earners
              </div>
              <h1 className="hero-title">
                Your money<br />
                finally has a <span className="text-gradient">brain.</span>
              </h1>
              <p className="hero-sub">
                PerFinAI reads your bank statement, tax filings, and payslips — then tells you exactly what to do next. No spreadsheets. No jargon.
              </p>
              <div className="hero-actions">
                <Link href="/signup">
                  <button className="btn-primary">Get Your Health Score <ArrowRight size={18} /></button>
                </Link>
                <button className="btn-secondary">See how it works</button>
              </div>
              <p className="hero-footer-text">
                ○ No bank login. No credentials. Just documents you already own.
              </p>
            </div>

            <div className="hero-visual-side">
              <div className="floating-chips">
                {/* Health Score Chip */}
                <div className="glass-card chip chip-health">
                  <div className="chip-header">FINANCIAL HEALTH SCORE</div>
                  <div className="chip-body">
                    <span className="chip-val">75</span>
                    <span className="chip-total">/100</span>
                  </div>
                  <div className="chip-progress-bg"><div className="chip-progress-fill" style={{ width: '75%' }}></div></div>
                  <div className="chip-footer">Top 20% of your age group</div>
                </div>

                {/* Net Worth Chip */}
                <div className="glass-card chip chip-nw">
                  <div className="chip-icon"><TrendingUp size={16} color={OLIVE} /> NET WORTH</div>
                  <div className="chip-val-large">₹14.2L</div>
                  <div className="chip-footer">Updated just now</div>
                </div>

                {/* CIBIL Chip */}
                <div className="glass-card chip chip-cibil">
                   <div className="chip-header">CIBIL SCORE</div>
                   <div className="chip-val-large" style={{ color: GOLD }}>742</div>
                   <div className="chip-footer">Reduce utilization below 30%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PROBLEM AWARENESS --- */}
        <section className="section-padding">
           <h2 className="section-title center">Most Indians have no idea what their<br/>financial health actually looks like.</h2>
           <div className="problem-grid">
              {problemCards.map((c, i) => (
                <div key={i} className="glass-card problem-card">
                   <div className="problem-icon">{c.icon}</div>
                   <h3>{c.title}</h3>
                   <p>{c.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* --- PROCESS STEPS --- */}
        <section className="section-padding">
           <h2 className="section-title center">Three steps to financial clarity.</h2>
           <div className="process-grid">
              <div className="process-item">
                 <div className="process-icon-box"><Upload size={24} /></div>
                 <h3>1. Upload your documents</h3>
                 <p>Payslip PDF, bank statement, Form 26AS. No bank login required.</p>
                 <div className="tag-row">
                    <span className="tag">PDF</span> <span className="tag">XLSX</span> <span className="tag">JSON</span>
                 </div>
              </div>
              <div className="process-sep"><ChevronRight size={24} /></div>
              <div className="process-item">
                 <div className="process-icon-box"><Cpu size={24} /></div>
                 <h3>2. AI reads & understands</h3>
                 <p>Parses income, expenses, and tax position. PII scrubbed instantly.</p>
                 <div className="tag-row">
                    <span className="tag">EXTRACTION</span> <span className="tag">ANALYSIS</span>
                 </div>
              </div>
              <div className="process-sep"><ChevronRight size={24} /></div>
              <div className="process-item">
                 <div className="process-icon-box"><Map size={24} /></div>
                 <h3>3. Get your roadmap</h3>
                 <p>Actionable tips, what-if simulations, and clear goal tracking.</p>
                 <div className="tag-row">
                    <span className="tag">SCORE</span> <span className="tag">CHAT</span>
                 </div>
              </div>
           </div>
        </section>

        {/* --- BENTO GRID --- */}
        <section className="section-padding">
          <h2 className="section-title center">Everything you need. <span style={{ color: OLIVE }}>Nothing you don't.</span></h2>
          <div className="bento-grid">
            {/* Health Score Small */}
            <div className="glass-card bento-item item-health">
               <h3>Financial Health Score</h3>
               <p>A unified 0–100 score across savings ratio, debt, emergency fund, investments, and credit health.</p>
               <div className="circle-progress">
                  <span className="circle-val">82</span>
               </div>
            </div>

            {/* CIBIL Tracker */}
            <div className="glass-card bento-item item-cibil">
               <h3>CIBIL Tracker</h3>
               <p>Tips to rebuild or boost your score past 750.</p>
               <div className="bento-val">742 <span className="bento-sub">/900</span></div>
            </div>

            {/* Tax Optimization */}
            <div className="glass-card bento-item item-tax" style={{ background: '#1A1610', borderColor: GOLD }}>
               <h3 style={{ color: GOLD }}>Tax Optimisation</h3>
               <p>Auto-detect missed 80C/80D deductions.</p>
               <div className="tax-insight">₹18,000 in missed deductions found</div>
            </div>

            {/* What-If */}
            <div className="glass-card bento-item item-simulator">
               <h3>What-If Simulator</h3>
               <p>"What if I take a ₹5L loan?" or "What if I quit my job in 6 months?"</p>
               <div className="sim-result">
                  <div className="sim-badge">SIMULATION RESULT</div>
                  <p>Quitting now leaves you with 3 months runway. Save ₹40k more before resigning.</p>
               </div>
            </div>

            {/* Emergency Fund */}
            <div className="glass-card bento-item item-emergency">
               <h3>Emergency Fund</h3>
               <p>Visual runway calculator based on actual burn rate.</p>
               <div className="em-bar-container">
                  <div className="em-bar-fill"></div>
               </div>
               <div className="em-footer">2.2 of 6 months covered</div>
            </div>

            {/* Smart Parsing */}
            <div className="glass-card bento-item item-parsing">
               <h3>Smart Parsing</h3>
               <p>Zero manual entry. Upload files, auto-populate everything.</p>
               <div className="tag-row">
                  <span className="tag">Payslip</span> <span className="tag">Bank XLS</span> <span className="tag">26AS</span> <span className="tag">GST</span>
               </div>
            </div>
          </div>
        </section>

        {/* --- PRIVACY SECTION --- */}
        <section className="section-padding privacy-section">
          <div className="privacy-glass">
            <h2 className="section-title center">We see your numbers.<br/>Never your identity.</h2>
            <p className="privacy-sub">Your financial data is yours. We built this so you never have to hand over credentials to get clarity.</p>

            <div className="pillar-grid">
               {[
                 { icon: <Shield size={20} />, title: "Zero credential access", desc: "We never ask for your bank login, UPI PIN, or Aadhaar. You upload documents you already have." },
                 { icon: <EyeOff size={20} />, title: "PII stripped at parse", desc: "Account numbers and VPAs are replaced with [ID] tokens instantly. We never store raw data." },
                 { icon: <User size={20} />, title: "You own your data", desc: "Delete your data anytime. We don't sell, share, or train on your personal financial info." },
                 { icon: <Database size={20} />, title: "Session-only processing", desc: "Documents are parsed in your session only. Nothing stored server-side after analysis." },
               ].map((p, i) => (
                 <div key={i} className="pillar">
                    <div className="pillar-icon">{p.icon}</div>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                 </div>
               ))}
            </div>

            {/* Data Flow Diagram */}
            <div className="flow-container">
               <div className="flow-title">HOW YOUR DATA FLOWS</div>
               <div className="flow-row">
                  <div className="flow-step">Document Upload<div className="flow-step-sub">Payslip / Bank PDF / 26AS</div></div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step active-step">PII Scrubber<div className="flow-step-sub">IDs → [tokens]</div></div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">AI Engine<div className="flow-step-sub">LLM analysis</div></div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step result-step">Insights<div className="flow-step-sub">Score + recommendations</div></div>
               </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>PerFin AI — Personal Finance Reimagined · 2026</p>
        </footer>
      </div>

      <style jsx>{`
        .landing-container { min-height: 100vh; background: ${DEEP}; color: #FFF; font-family: 'Inter', system-ui, sans-serif; position: relative; overflow-x: hidden; }
        .aura-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .blob { position: absolute; filter: blur(100px); border-radius: 50%; opacity: 0.3; }
        .blob-1 { width: 600px; height: 600px; background: ${OLIVE}; top: -10%; right: -5%; }
        .blob-2 { width: 500px; height: 500px; background: #2D1E1A; bottom: 5%; left: -5%; }
        
        .content-wrapper { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .section-padding { padding: 80px 0; }
        .section-title { font-size: 32px; font-weight: 700; line-height: 1.2; margin-bottom: 40px; }
        .center { text-align: center; }

        .glass-card { background: ${GLASS_BG}; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid ${GLASS_BORDER}; border-radius: 20px; }

        /* --- HERO --- */
        .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 100px; }
        .hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; width: 100%; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(163,94,71,0.1); border: 1px solid ${OLIVE}40; border-radius: 50px; font-size: 11px; font-weight: 600; color: ${OLIVE}; margin-bottom: 24px; }
        .dot { width: 6px; height: 6px; background: ${OLIVE}; border-radius: 50%; display: inline-block; }
        .hero-title { font-size: 64px; font-weight: 800; line-height: 1.05; letter-spacing: -0.04em; margin-bottom: 24px; }
        .text-gradient { background: linear-gradient(135deg, ${OLIVE}, ${GOLD}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { font-size: 18px; color: #BBB; line-height: 1.6; margin-bottom: 40px; max-width: 480px; }
        .hero-actions { display: flex; gap: 16px; margin-bottom: 40px; }
        .btn-primary { background: #1A1A1A; color: #FFF; border: 1px solid #333; padding: 14px 28px; border-radius: 50px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
        .btn-primary:hover { background: #000; scale: 1.02; border-color: ${OLIVE}; }
        .btn-secondary { background: #FFF; color: #000; border: none; padding: 14px 28px; border-radius: 50px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .hero-footer-text { font-size: 11px; color: #666; font-family: monospace; }

        /* --- CHIPS --- */
        .hero-visual-side { position: relative; height: 500px; display: flex; align-items: center; justify-content: center; }
        .chip { position: absolute; padding: 20px; width: 220px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .chip-health { top: 10%; right: 0; z-index: 5; }
        .chip-nw { top: 45%; left: -20px; z-index: 6; width: 200px; }
        .chip-cibil { bottom: 10%; right: 20px; z-index: 4; }
        
        .chip-header { font-size: 10px; font-weight: 700; color: #666; letter-spacing: 0.1em; margin-bottom: 12px; }
        .chip-body { display: flex; items-baseline; gap: 2px; margin-bottom: 12px; }
        .chip-val { font-size: 40px; font-weight: 800; line-height: 1; }
        .chip-total { font-size: 16px; color: #666; font-weight: 600; }
        .chip-progress-bg { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 12px; }
        .chip-progress-fill { height: 100%; background: ${OLIVE}; border-radius: 3px; }
        .chip-footer { font-size: 11px; color: #888; }
        .chip-icon { font-size: 10px; font-weight: 700; color: #666; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .chip-val-large { font-size: 28px; font-weight: 800; margin-bottom: 6px; }

        /* --- PROBLEMS --- */
        .problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .problem-card { padding: 32px; text-align: left; transition: 0.3s; }
        .problem-card:hover { transform: translateY(-5px); border-color: ${OLIVE}40; }
        .problem-icon { width: 40px; height: 40px; background: ${OLIVE}15; border-radius: 8px; color: ${OLIVE}; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 24px; }
        .problem-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; line-height: 1.3; }
        .problem-card p { font-size: 14px; color: #888; line-height: 1.6; }

        /* --- PROCESS --- */
        .process-grid { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding: 40px 0; }
        .process-item { flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .process-icon-box { width: 56px; height: 56px; background: ${OLIVE}; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 10px 30px ${OLIVE}40; }
        .process-item h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
        .process-item p { font-size: 13px; color: #888; max-width: 200px; line-height: 1.6; margin-bottom: 16px; }
        .process-sep { padding-top: 16px; color: #333; }
        .tag-row { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
        .tag { background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 4px; font-size: 9px; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); color: #777; letter-spacing: 0.05em; }

        /* --- BENTO --- */
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .bento-item { padding: 24px; position: relative; }
        .bento-item h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
        .bento-item p { font-size: 13px; color: #888; line-height: 1.5; margin-bottom: 20px; }
        
        .item-health { grid-column: span 2; display: flex; flex-direction: column; }
        .circle-progress { width: 70px; height: 70px; border: 4px solid #222; border-top-color: ${OLIVE}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: auto; }
        .circle-val { font-size: 24px; font-weight: 800; }
        
        .bento-val { font-size: 32px; font-weight: 800; color: ${OLIVE}; }
        .bento-sub { font-size: 14px; color: #444; }
        .tax-insight { background: ${GOLD}20; border: 1px solid ${GOLD}40; padding: 10px; border-radius: 8px; color: ${GOLD}; font-size: 12px; font-weight: 700; text-align: center; }
        
        .item-simulator { grid-column: span 2; }
        .sim-result { background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; border-left: 3px solid ${OLIVE}; }
        .sim-badge { font-size: 9px; font-weight: 800; color: ${OLIVE}; letter-spacing: 0.1em; margin-bottom: 8px; }
        .sim-result p { margin-bottom: 0; color: #DDD; font-size: 14px; }
        
        .em-bar-container { height: 8px; background: #222; border-radius: 4px; margin-bottom: 12px; }
        .em-bar-fill { width: 40%; height: 100%; background: #F59E0B; border-radius: 4px; }
        .em-footer { font-size: 11px; color: #666; }

        /* --- PRIVACY --- */
        .privacy-glass { padding: 60px 40px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 40px; margin-bottom: 80px; }
        .privacy-sub { text-align: center; color: #777; max-width: 600px; margin: 0 auto 60px; line-height: 1.6; }
        .pillar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 80px; }
        .pillar { text-align: left; }
        .pillar-icon { color: ${GOLD}; margin-bottom: 16px; }
        .pillar h4 { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
        .pillar p { font-size: 12px; color: #666; line-height: 1.6; }

        .flow-container { background: rgba(0,0,0,0.4); padding: 32px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .flow-title { font-size: 10px; font-weight: 800; color: #444; letter-spacing: 0.15em; text-align: center; margin-bottom: 32px; }
        .flow-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .flow-step { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; flex: 1; text-align: center; }
        .flow-step-sub { font-size: 10px; font-weight: 500; color: #555; margin-top: 4px; }
        .active-step { border-color: ${OLIVE}; background: ${OLIVE}10; }
        .result-step { background: #FFF; color: #000; border: none; }
        .flow-arrow { color: #333; font-weight: 700; }

        .footer { text-align: center; padding: 40px 0; color: #444; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05); }

        @media (max-width: 1024px) {
           .hero-grid { grid-template-columns: 1fr; }
           .hero-visual-side { display: none; }
           .problem-grid { grid-template-columns: 1fr; }
           .process-grid { flex-direction: column; align-items: center; }
           .process-sep { transform: rotate(90deg); padding: 20px 0; }
           .bento-grid { grid-template-columns: 1fr; }
           .item-health, .item-simulator { grid-column: span 1; }
           .pillar-grid { grid-template-columns: 1fr 1fr; }
           .flow-row { flex-direction: column; gap: 16px; }
           .flow-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </main>
  );
}
