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
        'flex items-center justify-between gap-4',
        'text-[11px] text-muted-foreground/50',
        className
      )}
    >
      <span>واترمارک‌ساز · {t.footer.version}</span>
      <Link
        href="https://github.com/Alirewa"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-muted-foreground transition-colors"
      >
        {t.footer.developedBy}
      </Link>
    </footer>
  );
}
