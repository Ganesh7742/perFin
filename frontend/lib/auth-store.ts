import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { usePerFinStore } from './store';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete axios.defaults.headers.common['Authorization'];
        // Clear financial data on logout
        usePerFinStore.getState().reset();
      },
    }),
    {
      name: 'perfin-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize axios with token from localStorage if it exists
if (typeof window !== 'undefined') {
  const storedAuth = localStorage.getItem('perfin-auth-storage');
  if (storedAuth) {
    try {
      const { state } = JSON.parse(storedAuth);
      if (state.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error('Failed to parse auth storage', error);
    }
  }
}
