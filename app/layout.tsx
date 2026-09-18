import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Opal Sky Media Agency',
  description:
    'Become a BOSS with Opal Sky Media. Enroll now as a content creator, scale your TikTok growth, run optimized ads, and boost your brand reach globally.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
