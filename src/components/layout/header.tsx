import Link from 'next/link';
import { Shrub } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
        <Shrub className="h-6 w-6 text-primary" />
        <span className="font-headline text-2xl font-semibold">CodeSpruce Cleaning</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          href="/#services"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Services
        </Link>
        <Link
          href="/custom-plan"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Custom Plan
        </Link>
        <Button asChild>
          <Link href="/dashboard">For Cleaners</Link>
        </Button>
      </nav>
    </header>
  );
}
