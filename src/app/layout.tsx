import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShadowTrace — Personal Footprint & Doxxing Audit Agent',
  description: 'Discover what the open web knows about you before an adversary or employer does. Built by Adarsh Panicker for Hack1984 (Surge Track).',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b12] text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
