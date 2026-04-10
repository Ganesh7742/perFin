'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';
import { useRouter } from 'next/navigation';
import { usePerFinStore } from '../lib/store';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/projection', label: 'Projection' },
  { href: '/goals', label: 'Goals' },
  { href: '/chat', label: 'AI Advisor' },
  { href: '/learn', label: 'Learn' },
];

const OLIVE  = '#A35E47';
const CARD   = '#FFFFFF';
const BG     = '#FAFAFA';
const BORDER = '#9C9A9A';
const SEC    = '#464646';
const MUTED  = '#9C9A9A';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();
  const { analysis } = usePerFinStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const isActive = (href) => pathname === href;

  // Hide nav links on login/signup, or on first-visit /input (no analysis yet)
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    (pathname === '/input' && !analysis);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: CARD,
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── Main bar ── */}
      <div
        style={{
          padding: '0 32px',
          height: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            background: OLIVE,
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: OLIVE, letterSpacing: '-0.02em' }}>PerFin</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {!isAuthPage && (
            isAuthenticated ? (
              <>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 5,
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      letterSpacing: '0.01em',
                      color: isActive(l.href) ? OLIVE : SEC,
                      background: isActive(l.href) ? 'rgba(163,94,71,0.10)' : 'transparent',
                    }}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Profile avatar → /input */}
                <Link href="/input" style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
                  <img
                    src="/profile.png"
                    alt="Profile"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: `1px solid ${BORDER}`,
                      objectFit: 'cover',
                    }}
                  />
                </Link>

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 12px',
                    borderRadius: 5,
                    fontSize: 13,
                    fontWeight: 500,
                    background: 'rgba(163,94,71,0.08)',
                    color: OLIVE,
                    border: '1px solid rgba(163,94,71,0.20)',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: '5px 14px',
                    borderRadius: 5,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: SEC,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <LogIn size={13} /> Sign In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    padding: '5px 14px',
                    borderRadius: 5,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: CARD,
                    background: OLIVE,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginLeft: 4,
                  }}
                >
                  <UserPlus size={13} /> Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && !isAuthPage && (
        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            background: CARD,
            padding: '10px 20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {isAuthenticated ? (
            <>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    padding: '9px 10px',
                    borderRadius: 5,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive(l.href) ? OLIVE : SEC,
                    background: isActive(l.href) ? 'rgba(163,94,71,0.08)' : 'transparent',
                  }}
                >
                  {l.label}
                </Link>
              ))}

              <div style={{ height: 1, background: BORDER, margin: '4px 0' }} />

              <Link
                href="/input"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}
              >
                <img
                  src="/profile.png"
                  alt="Profile"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${OLIVE}`,
                    objectFit: 'cover',
                  }}
                />
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px',
                  borderRadius: 5,
                  fontSize: 13,
                  color: OLIVE,
                  background: 'rgba(163,94,71,0.08)',
                  border: '1px solid rgba(163,94,71,0.20)',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={13} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '9px',
                  borderRadius: 5,
                  fontSize: 13,
                  textDecoration: 'none',
                  textAlign: 'center',
                  color: SEC,
                  background: '#F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <LogIn size={13} /> Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '9px',
                  borderRadius: 5,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  textAlign: 'center',
                  color: BG,
                  background: OLIVE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <UserPlus size={13} /> Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
