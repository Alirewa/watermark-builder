'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function HelpClientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-4">
        <h1 className="text-2xl font-bold">راهنما</h1>
        <p className="text-sm text-muted-foreground mt-1">
          مستندات و راهنمای استفاده از واترمارکر — به زودی...
        </p>
      </div>
    </DashboardLayout>
  );
}
