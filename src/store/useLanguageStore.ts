// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/i18n/translations';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: 'fa',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'fa' ? 'en' : 'fa' }),
    }),
    { name: 'wm-lang' }
  )
);
