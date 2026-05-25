// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/i18n/translations';

/**
 * Returns the current language's translation object and lang code.
 * Usage: const { t, lang } = useT();
 */
export function useT() {
  const { lang, toggleLang } = useLanguageStore();
  return { t: translations[lang], lang, toggleLang };
}
