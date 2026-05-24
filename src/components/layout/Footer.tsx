'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'shrink-0 border-t border-border/50',
        'px-4 sm:px-6 py-2.5',
        'flex items-center justify-between gap-4',
        'text-[11px] text-muted-foreground/50',
        className
      )}
    >
      <span>واترمارک‌ساز · نسخه ۱.۰.۰</span>
      <Link
        href="https://github.com/Alirewa"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-muted-foreground transition-colors"
      >
        Developed by @Alirewa
      </Link>
    </footer>
  );
}
