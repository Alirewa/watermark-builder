// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';

/**
 * Keeps <html lang="…" dir="…"> in sync with the active language.
 * Mount once in DashboardLayout (or ThemeWrapper).
 */
export function DirectionSetter() {
  const { lang } = useLanguageStore();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  return null;
}
