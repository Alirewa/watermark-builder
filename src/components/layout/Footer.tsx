// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useT } from '@/hooks/useT';

export function Footer({ className }: { className?: string }) {
  const { t } = useT();

  return (
    <footer
      className={cn(
        'shrink-0 border-t border-border/50',
        'px-4 sm:px-6 py-2.5',
        'flex items-center justify-between gap-x-4 gap-y-1 flex-wrap',
        'text-[11px] text-muted-foreground/60',
        className
      )}
    >
      {/* Project name + version — always on the left (physical) */}
      <span className="whitespace-nowrap">
        {t.footer.appName}
        <span className="mx-1.5 opacity-40">·</span>
        {t.footer.version}
      </span>

      {/* Author link — always on the right */}
      <Link
        href="https://github.com/Alirewa"
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap hover:text-muted-foreground transition-colors"
      >
        {t.footer.developedBy}
      </Link>
    </footer>
  );
}
