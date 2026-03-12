import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PerFin AI — Personal Finance Copilot',
  description: 'AI-powered personal finance analyzer. Track wealth, plan goals, and get personalized advice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
