import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';
import { Belleza, Alegreya } from 'next/font/google';

const belleza = Belleza({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: '400',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-body',
});


export const metadata: Metadata = {
  title: 'spruces.',
  description: 'Your portal for managing cleaning jobs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${belleza.variable} ${alegreya.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
