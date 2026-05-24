'use client';

import { Droplets, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WatermarkStudio } from '@/features/watermark/WatermarkStudio';

export default function WatermarkClientPage() {
  return (
    <DashboardLayout>
      {/* Studio Page Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-[0_4px_16px_rgba(97,114,243,0.3)] shrink-0">
            <Droplets className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black leading-tight">
              استودیوی واترمارک
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
              تصاویر و لوگوی خود را بارگذاری کنید — واترمارک‌ها به صورت هوشمند روی تمام تصاویر پراکنده می‌شوند
            </p>
          </div>
          <div className="ms-auto hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground rounded-xl bg-muted/60 px-3 py-1.5 shrink-0">
            <Sparkles className="size-3.5 text-primary" />
            پراکندگی هوشمند
          </div>
        </div>
      </div>

      <WatermarkStudio />
    </DashboardLayout>
  );
}
