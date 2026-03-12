// lib/api.ts — Axios client for FastAPI backend
import axios from 'axios';
import { FinancialProfile, AnalysisResult } from './store';
import { useAuthStore } from './auth-store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function analyzeProfile(profile: FinancialProfile): Promise<AnalysisResult> {
  const { data } = await api.post('/analyze', profile);
  return data;
}

export async function sendChatMessage(message: string, profile: FinancialProfile): Promise<string> {
  const { data } = await api.post('/chat', { message, profile });
  return data.response;
}

export async function getProfile(): Promise<AnalysisResult> {
  const { data } = await api.get('/analyze/me');
  return data;
}

export default api;
