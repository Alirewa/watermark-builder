'use client';

import { Shield, Star, Zap, Headphones } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LicenseActivationCard } from '@/features/license/LicenseActivationCard';
import { GlassCard } from '@/components/ui/card';

const benefits = [
  {
    icon: Zap,
    title: 'پردازش نامحدود',
    desc: 'بدون محدودیت تعداد تصویر پردازش کنید',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Star,
    title: 'کیفیت حرفه‌ای',
    desc: 'خروجی با کیفیت بالا و بدون کاهش وضوح',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    title: 'امنیت پیشرفته',
    desc: 'واترمارک‌های غیرقابل حذف و رمزگذاری‌شده',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴/۷',
    desc: 'دسترسی به تیم پشتیبانی در هر زمان',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

export default function LicenseClientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Shield className="size-4" />
            سیستم لایسنس
          </div>
          <h1 className="text-3xl font-black mb-3">
            <span className="gradient-text">فعال‌سازی نرم‌افزار</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            برای استفاده از تمامی امکانات واترمارکر، کلید لایسنس خود را وارد کنید
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3">
            <LicenseActivationCard />
          </div>
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
              مزایای لایسنس
            </p>
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <GlassCard key={b.title} className="flex items-start gap-3 p-4 floating-card">
                  <div className={`size-9 rounded-xl ${b.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`size-4 ${b.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{b.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
                  </div>
                </GlassCard>
              );
            })}
            <GlassCard className="p-4 bg-primary/5 border-primary/20">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 برای دریافت کلید لایسنس با تیم فروش تماس بگیرید یا از پنل کاربری خود دریافت کنید.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
