'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TemplatesClientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-4">
        <h1 className="text-2xl font-bold">قالب‌های آماده</h1>
        <p className="text-sm text-muted-foreground mt-1">
          از قالب‌های از پیش طراحی‌شده استفاده کنید — به زودی...
        </p>
      </div>
    </DashboardLayout>
  );
}
