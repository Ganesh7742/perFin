'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projection', label: 'Projection' },
  { href: '/goals', label: 'Goals' },
  { href: '/chat', label: 'AI Advisor' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0f]/85 backdrop-blur-md border-b border-white/10">
      <div className="px-4 md:px-8 h-[60px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center">
            <TrendingUp size={16} color="white" />
          </div>
          <span className="font-bold text-base text-slate-100">PerFin<span className="text-indigo-400">AI</span></span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              {links.map(l => (
                <Link key={l.href} href={l.href} 
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                    pathname === l.href ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/input" className="ml-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-gradient-to-br from-indigo-500 to-indigo-400 hover:opacity-90 transition-opacity">
                Update Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
                <LogIn size={14} />
                Sign In
              </Link>
              <Link href="/signup" className="ml-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5">
                <UserPlus size={14} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0f] px-4 py-4 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              {links.map(l => (
                <Link key={l.href} href={l.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === l.href ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2"></div>
              <Link href="/input" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 to-indigo-400 text-center"
              >
                Update Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-red-400/10"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 bg-slate-800/50 flex items-center justify-center gap-2">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-500 flex items-center justify-center gap-2">
                <UserPlus size={16} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
