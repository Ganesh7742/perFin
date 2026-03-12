'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { sendChatMessage } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Can I buy a car worth ₹10L next year?',
  'When can I retire?',
  'How much should I invest in SIP monthly?',
  'Is my emergency fund sufficient?',
  'How to reduce my debt faster?',
  'Am I saving enough for retirement?',
];

export default function ChatPage() {
  const router = useRouter();
  const { analysis, profile } = usePerFinStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: profile
        ? `Hello ${profile.name}! 👋 I'm your AI Financial Advisor. I have full access to your financial profile — income of ${formatINR(profile.monthly_income)}/month, net worth of ${formatINR(analysis?.net_worth ?? 0)}, and ${analysis?.goals.length ?? 0} goal(s). Ask me anything about your finances!`
        : `Hello! I'm your AI Financial Advisor powered by Gemini. Please build your financial profile first to get personalized advice.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) router.push('/input');
  }, [profile, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || !profile) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(msg, profile);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Could not connect to the AI backend. Make sure the FastAPI server is running on port 8000 and your GEMINI_API_KEY is set in the .env file.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 0', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg,#6366f1,#818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>AI Financial Advisor</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="pulse-dot" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by Google Gemini · Personalized to your profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="btn-ghost" style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20 }}>
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="glass-card" style={{
          flex: 1, padding: 24, marginBottom: 16,
          overflowY: 'auto', maxHeight: 480, display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12,
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: m.role === 'user' ? 'rgba(99,102,241,0.2)' : 'linear-gradient(135deg,#6366f1,#818cf8)',
              }}>
                {m.role === 'user' ? <User size={15} color="#818cf8" /> : <Sparkles size={15} color="white" />}
              </div>
              <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: m.role === 'user' ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                border: '1px solid',
                borderColor: m.role === 'user' ? 'rgba(99,102,241,0.3)' : 'var(--border)',
                fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg,#6366f1,#818cf8)',
              }}>
                <Sparkles size={15} color="white" />
              </div>
              <div style={{
                padding: '12px 18px', borderRadius: '4px 16px 16px 16px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)',
                fontSize: 14,
              }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Analyzing your finances...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input
            className="input-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your finances..."
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            style={{ flex: 1, padding: '14px 18px', fontSize: 14 }}
          />
          <button
            className="btn-accent"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
