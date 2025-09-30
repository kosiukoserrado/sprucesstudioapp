import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'SprucesApp',
  description: 'Your portal for managing cleaning jobs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
