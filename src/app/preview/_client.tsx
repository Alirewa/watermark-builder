// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PreviewArea } from '@/features/preview/PreviewArea';

export default function PreviewClientPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">پیش‌نمایش</h1>
          <p className="text-sm text-muted-foreground mt-1">
            نتیجه نهایی واترمارک را مشاهده کنید
          </p>
        </div>
        <div className="flex-1 min-h-[500px]">
          <PreviewArea />
        </div>
      </div>
    </DashboardLayout>
  );
}
