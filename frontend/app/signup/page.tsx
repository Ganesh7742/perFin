'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import api, { getProfile } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { usePerFinStore } from '@/lib/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

type SignupStep = 'EMAIL' | 'OTP' | 'PASSWORD';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<SignupStep>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAnalysis = usePerFinStore((state) => state.setAnalysis);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/otp/send-otp`, { email });
      setStep('OTP');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/otp/verify-otp`, { email, otp });
      setStep('PASSWORD');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
      });
      
      // Auto-login immediately after signup
      const loginResponse = await api.post(`/auth/login`, {
        email,
        password,
      });
      const { access_token } = loginResponse.data;
      // Clear any previous data before starting a new session
      usePerFinStore.getState().reset();
      setAuth({ id: 'temp-id', email }, access_token);
      
      try {
        const profileData = await getProfile();
        setAnalysis(profileData);
        router.push('/dashboard');
      } catch (profileErr: any) {
        // Typically a new user won't have a profile yet
        router.push('/input');
      }
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-logo">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18c-.71 1.41-1.11 3-1.11 4.69 0 1.69.4 3.28 1.11 4.69l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
             </svg>
          </div>
          <h1 className="auth-title">
            {step === 'EMAIL' && 'Sign up'}
            {step === 'OTP' && 'Verify it\'s you'}
            {step === 'PASSWORD' && 'Create a strong password'}
          </h1>
          <p className="auth-subtitle">
            {step === 'EMAIL' && 'Use your email to create a PerFin Account'}
            {step === 'OTP' && `We've sent a 6-digit code to ${email}`}
            {step === 'PASSWORD' && 'Finish setting up your account'}
          </p>
        </div>

        <div className="auth-right">
          {step === 'EMAIL' && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="google-input-wrapper">
                <input
                  type="email"
                  className="google-input"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="auth-info-text">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </div>
              {error && <div style={{ color: '#d93025', fontSize: 13, marginTop: 16 }}>{error}</div>}
              <div className="auth-actions" style={{ marginTop: 'auto' }}>
                <Link href="/login" className="auth-btn-secondary">
                  Sign in instead
                </Link>
                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="google-input-wrapper">
                <input
                  type="text"
                  className="google-input"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  autoFocus
                  style={{ letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}
                />
              </div>
              <p style={{ fontSize: 14, color: '#5f6368', marginTop: 16 }}>
                Didn't get a code? <button type="button" onClick={handleSendOtp} disabled={isLoading} className="auth-link">Resend</button>
              </p>
              {error && <div style={{ color: '#d93025', fontSize: 13, marginTop: 16 }}>{error}</div>}
              <div className="auth-actions" style={{ marginTop: 'auto' }}>
                <button type="button" className="auth-btn-secondary" onClick={() => setStep('EMAIL')}>
                  Back
                </button>
                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {step === 'PASSWORD' && (
            <form onSubmit={handleFinalizeSignup} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="google-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="google-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="google-input-wrapper" style={{ marginTop: 24 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="google-input"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <input 
                  type="checkbox" 
                  id="show-signup" 
                  checked={showPassword} 
                  onChange={() => setShowPassword(!showPassword)} 
                />
                <label htmlFor="show-signup" style={{ fontSize: 14 }}>Show password</label>
              </div>
              <p style={{ fontSize: 12, color: '#5f6368', marginTop: 8 }}>
                Use 8 or more characters with a mix of letters, numbers & symbols
              </p>
              {error && <div style={{ color: '#d93025', fontSize: 13, marginTop: 16 }}>{error}</div>}
              <div className="auth-actions" style={{ marginTop: 'auto' }}>
                <button type="button" className="auth-btn-secondary" onClick={() => setStep('OTP')}>
                  Back
                </button>
                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
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
