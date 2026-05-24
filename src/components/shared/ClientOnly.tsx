'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  /** Rendered during SSR / before hydration. Defaults to blank. */
  fallback?: React.ReactNode;
}

/**
 * Prevents any child from rendering during SSR or static generation.
 * Required for Zustand stores (useSyncExternalStore) and next-themes
 * when using Next.js `output: 'export'`.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
