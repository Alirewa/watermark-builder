// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ── Single icon toggle (header) ──────────────────────────── */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="size-9 rounded-xl bg-muted animate-pulse" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-xl size-9 relative overflow-hidden"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="size-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

/* ── 3-option selector (settings page) ───────────────────── */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-24 rounded-xl bg-muted animate-pulse" />;

  const options = [
    { value: 'light',  label: 'روشن',  icon: Sun     },
    { value: 'dark',   label: 'تاریک', icon: Moon    },
    { value: 'system', label: 'سیستم', icon: Monitor },
  ] as const;

  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl bg-muted p-1 shrink-0">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={cn(
            'flex items-center gap-1.5 rounded-lg transition-all text-xs font-medium',
            /* mobile: icon-only → compact */
            'px-2.5 py-1.5',
            /* sm+: show label text */
            'sm:px-3',
            theme === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
