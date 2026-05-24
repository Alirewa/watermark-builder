import dynamic from 'next/dynamic';
import { AppShell } from '@/components/shared/AppShell';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'قالب‌ها' };

const App = dynamic(() => import('./_client'), {
  ssr: false,
  loading: () => <AppShell />,
});

export default function TemplatesPage() {
  return <App />;
}
