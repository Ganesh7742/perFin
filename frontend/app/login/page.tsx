'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import api, { getProfile } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { usePerFinStore } from '@/lib/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAnalysis = usePerFinStore((state) => state.setAnalysis);

  useEffect(() => {
    // Check for successful signup from URL params if needed
  }, [searchParams]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Enter an email");
      return;
    }
    setError(null);
    setShowPassword(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post(`/auth/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      setAuth({ id: 'temp-id', email }, access_token);
      
      try {
        const profileData = await getProfile();
        setAnalysis(profileData);
        router.push('/dashboard');
      } catch (profileErr: any) {
        if (profileErr.response?.status === 404) {
          router.push('/input');
        } else {
           setError("Error fetching profile, continuing to input...");
           router.push('/input');
        }
      }

    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-logo">
             {/* Google-like logo (using PerFin logo style) */}
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18c-.71 1.41-1.11 3-1.11 4.69 0 1.69.4 3.28 1.11 4.69l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
             </svg>
          </div>
          <h1 className="auth-title">{showPassword ? 'Welcome' : 'Sign in'}</h1>
          <p className="auth-subtitle">
            {showPassword ? email : 'Use your PerFin Account'}
          </p>
        </div>

        <div className="auth-right">
          {!showPassword ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="google-input-wrapper">
                <input
                  type="email"
                  className="google-input"
                  placeholder="Email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="button" className="auth-link" style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                Forgot email?
              </button>

              <div className="auth-info-text">
                Not your computer? Use Guest mode to sign in privately. <button type="button" className="auth-link">Learn more</button>
              </div>

              {error && <div style={{ color: '#d93025', fontSize: 13, marginTop: 10 }}>{error}</div>}

              <div className="auth-actions">
                <Link href="/signup" className="auth-btn-secondary">
                  Create account
                </Link>
                <button type="submit" className="auth-btn-primary">
                  Next
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="google-input-wrapper" style={{ marginTop: 20 }}>
                <input
                  type="password"
                  className="google-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <input type="checkbox" id="show" checked={false} onChange={() => {}} />
                  <label htmlFor="show" style={{ fontSize: 14 }}>Show password</label>
              </div>

              {error && <div style={{ color: '#d93025', fontSize: 13, marginTop: 10 }}>{error}</div>}

              <div className="auth-actions" style={{ marginTop: 'auto' }}>
                <button type="button" className="auth-btn-secondary" onClick={() => setShowPassword(false)}>
                  Back
                </button>
                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="auth-footer">
        <div>English (United States)</div>
        <div className="footer-links">
          <Link href="#">Help</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </div>
      </div>
    </div>
  );
}
