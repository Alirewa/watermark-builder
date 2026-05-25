// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { Menu, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useT } from '@/hooks/useT';
import type { Translations } from '@/i18n/translations';

interface HeaderProps {
  onMenuClick?: () => void;
}

function getPageTitle(pathname: string, t: Translations) {
  const map: Record<string, string> = {
    '/': t.nav.dashboard,
    '/watermark': t.watermarkPage.title,
    '/settings': t.nav.settings,
  };
  return map[pathname] ?? t.nav.dashboard;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { t, lang, toggleLang } = useT();
  const title = getPageTitle(pathname, t);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-[var(--header-height,64px)]',
        'flex items-center gap-3 px-4 sm:px-6',
        'glass border-b border-border'
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-xl shrink-0"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      {/* Brand mark — mobile only */}
      <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
        <div className="size-7 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
          <Droplets className="size-3.5 text-white" />
        </div>
        <span className="font-bold text-sm">{t.header.brand}</span>
      </Link>

      {/* Page title — desktop */}
      <motion.div
        key={`${pathname}-${lang}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:block flex-1 min-w-0"
      >
        <h1 className="text-sm font-bold text-muted-foreground truncate">{title}</h1>
      </motion.div>

      <div className="flex-1 lg:hidden" />

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          title={t.header.switchLang}
          className={cn(
            'h-8 px-3 rounded-xl text-xs font-bold border border-border',
            'bg-background hover:bg-accent transition-colors',
            'text-muted-foreground hover:text-foreground tracking-wide'
          )}
        >
          {t.header.switchLang}
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
