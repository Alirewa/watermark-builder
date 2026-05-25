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
  // 2-char code for the target language shown on narrow screens
  const langShort = lang === 'fa' ? 'EN' : 'FA';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-[var(--header-height,64px)]',
        'flex items-center gap-2 px-3 sm:px-5',
        'glass border-b border-border'
      )}
    >
      {/* ── Mobile hamburger ───────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-xl shrink-0 size-9"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      {/* ── Brand (mobile only) ─────────────────────────
           Always show the icon; show text only on sm+    */}
      <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
        <div className="size-7 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm shrink-0">
          <Droplets className="size-3.5 text-white" />
        </div>
        <span className="hidden sm:block font-bold text-sm truncate max-w-[130px]">
          {t.header.brand}
        </span>
      </Link>

      {/* ── Page title (desktop only) ───────────────────── */}
      <motion.div
        key={`${pathname}-${lang}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:block flex-1 min-w-0"
      >
        <h1 className="text-sm font-bold text-muted-foreground truncate">{title}</h1>
      </motion.div>

      {/* Flexible spacer — only needed on mobile */}
      <div className="flex-1 lg:hidden" />

      {/* ── Right-side actions ──────────────────────────── */}
      <div className="flex items-center gap-1 shrink-0">
        {/*
          Language toggle:
            • < sm  → compact square (size-9) showing 2-char code: EN / FA
            • sm+   → wider pill showing full label: "English" / "فارسی"
        */}
        <button
          onClick={toggleLang}
          title={t.header.switchLang}
          className={cn(
            'rounded-xl border border-border transition-colors',
            'bg-background hover:bg-accent',
            'text-muted-foreground hover:text-foreground font-bold',
            // mobile: square icon-size
            'flex items-center justify-center size-9 text-[10px] tracking-[0.06em] uppercase',
            // sm+: pill with full text
            'sm:size-auto sm:h-9 sm:px-3 sm:text-xs sm:tracking-wide sm:normal-case'
          )}
        >
          <span className="sm:hidden leading-none">{langShort}</span>
          <span className="hidden sm:inline">{t.header.switchLang}</span>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
