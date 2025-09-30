import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'CodeSpruce Cleaner App',
  description: 'Your portal for managing cleaning jobs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
