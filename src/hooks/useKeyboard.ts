// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useEffect } from 'react';

type KeyMap = Record<string, (e: KeyboardEvent) => void>;

export function useKeyboard(keyMap: KeyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push('mod');
      if (e.shiftKey) parts.push('shift');
      if (e.altKey) parts.push('alt');
      parts.push(e.key.toLowerCase());

      const combo = parts.join('+');
      const fn = keyMap[combo] ?? keyMap[e.key.toLowerCase()];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap, enabled]);
}
