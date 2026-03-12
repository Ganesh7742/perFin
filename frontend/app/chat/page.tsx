'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { sendChatMessage } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const OLIVE = '#A35E47';
const DEEP  = '#000000';
const BG    = '#FAFAFA';
const CARD  = '#FFFFFF';
const CARD2 = '#F0F0F0';
const BORDER= '#9C9A9A';
const SEC   = '#464646';
const MUTED = '#9C9A9A';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUGGESTIONS = [
  'Can I buy a car worth ₹10L next year?',
  'When can I retire?',
  'How much should I invest in SIP monthly?',
  'Is my emergency fund sufficient?',
  'How to reduce my debt faster?',
];

export default function ChatPage() {
  const router = useRouter();
  const { analysis, profile } = usePerFinStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    usePerFinStore.persist.onFinishHydration(() => setHasHydrated(true));
    setHasHydrated(usePerFinStore.persist.hasHydrated());
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (hasHydrated && !messages.length) {
      setMessages([{
        role: 'assistant',
        content: profile
          ? `Hello ${profile.name}! I'm your AI Financial Advisor. I have access to your financial profile — income of ${formatINR(profile.monthly_income)}/month, net worth of ${formatINR(analysis?.net_worth ?? 0)}, and ${analysis?.goals.length ?? 0} goal(s). Ask me anything about your finances.`
          : `Hello! I'm your AI Financial Advisor. Please build your financial profile first to get personalized advice.`,
      }]);
    }
  }, [hasHydrated, profile, analysis, messages.length]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if (hasHydrated && !profile) router.push('/input'); 
  }, [profile, hasHydrated, router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Could not connect to the AI backend. Make sure the FastAPI server is running.' }]);
    } finally { setLoading(false); }
  };

  if (!hasHydrated || !profile) return null;

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingTop: 76, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px 0', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 5, background: OLIVE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={19} color={BG} />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: DEEP }}>AI Financial Advisor</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: OLIVE }} />
              <span style={{ fontSize: 11, color: MUTED }}>Powered by Google Gemini · Personalized to your profile</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 4, cursor: 'pointer', background: CARD, border: `1px solid ${BORDER}`, color: SEC, fontFamily: 'Inter, sans-serif' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: 18, marginBottom: 10, overflowY: 'auto', maxHeight: 420, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.role === 'user' ? 'rgba(99,107,47,0.15)' : OLIVE }}>
                {m.role === 'user' ? <User size={13} color={OLIVE} /> : <Bot size={13} color={BG} />}
              </div>
              <div style={{ maxWidth: '82%', padding: '9px 13px', borderRadius: 5, background: m.role === 'user' ? 'rgba(99,107,47,0.07)' : BG, border: `1px solid ${BORDER}`, fontSize: 13, lineHeight: 1.75, color: DEEP, whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <div style={{ width: 26, height: 26, borderRadius: 4, background: OLIVE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={13} color={BG} /></div>
              <div style={{ padding: '9px 13px', borderRadius: 5, background: BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 7, color: MUTED, fontSize: 12 }}>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 7, marginBottom: 24 }}>
          <input style={{ flex: 1, padding: '11px 15px', fontSize: 13, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 5, color: DEEP, fontFamily: 'Inter, sans-serif', outline: 'none' }}
            value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your finances..."
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ background: OLIVE, color: BG, border: 'none', borderRadius: 5, padding: '11px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: loading || !input.trim() ? 0.5 : 1 }}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
