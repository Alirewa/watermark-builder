// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsPanel } from '@/features/settings/SettingsPanel';

export default function SettingsClientPage() {
  return (
    <DashboardLayout>
      <SettingsPanel />
    </DashboardLayout>
  );
}
