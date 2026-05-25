// Developed by @Alirewa — https://github.com/Alirewa
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'داشبورد' };

// No loading fallback — ssr:false renders null during static gen
const App = dynamic(() => import('./_client'), { ssr: false });

export default function DashboardPage() {
  return <App />;
}
