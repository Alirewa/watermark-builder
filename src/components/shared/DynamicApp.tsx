// Developed by @Alirewa — https://github.com/Alirewa
'use client';

/**
 * Re-export of DashboardLayout loaded through a dynamic() boundary so that
 * Next.js `output: 'export'` does NOT try to SSR Zustand / next-themes.
 *
 * Usage in any page:
 *   import { DynamicLayout } from '@/components/shared/DynamicApp';
 */

import dynamic from 'next/dynamic';
import { AppShell } from './AppShell';

export const DynamicLayout = dynamic(
  () => import('@/components/layout/DashboardLayout').then((m) => m.DashboardLayout),
  { ssr: false, loading: () => <AppShell /> }
);
