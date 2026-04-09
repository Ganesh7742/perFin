import './globals.css';

export const metadata = {
  title: 'PerFin AI — Personal Finance Copilot',
  description: 'AI-powered personal finance analyzer. Track wealth, plan goals, and get personalized advice.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
