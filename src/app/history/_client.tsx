'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function HistoryClientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-4">
        <h1 className="text-2xl font-bold">تاریخچه پردازش</h1>
        <p className="text-sm text-muted-foreground mt-1">
          سابقه تصاویر پردازش‌شده — به زودی...
        </p>
      </div>
    </DashboardLayout>
  );
}
