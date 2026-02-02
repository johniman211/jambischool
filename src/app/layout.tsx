import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Jambi School - School Management System',
  description: 'Complete School Management System for Schools & Education NGOs. Manage students, attendance, academics, fees, and more.',
  keywords: ['school management', 'education', 'student management', 'attendance', 'fees', 'academics'],
  authors: [{ name: 'Jambi School' }],
  openGraph: {
    title: 'Jambi School - School Management System',
    description: 'Complete School Management System for Schools & Education NGOs',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
