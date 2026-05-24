'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadSection } from '@/features/upload/UploadSection';

export default function UploadClientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">آپلود تصویر</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تصاویر مورد نظر برای اعمال واترمارک را آپلود کنید
          </p>
        </div>
        <UploadSection />
      </div>
    </DashboardLayout>
  );
}
