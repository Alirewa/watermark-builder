'use client';

/**
 * Root dashboard — clean, Persian-first studio landing.
 * Imported via dynamic(ssr:false) from page.tsx.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Droplets,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Images,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useWatermarkStore } from '@/store/useWatermarkStore';

const features = [
  {
    icon: Images,
    title: 'تا ۱۰۰ تصویر همزمان',
    desc: 'بارگذاری دسته‌ای تصاویر و پردازش موازی',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Sparkles,
    title: 'پراکندگی هوشمند',
    desc: 'قرارگیری تصادفی و طبیعی واترمارک‌ها',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Zap,
    title: 'ابعاد اصلی محفوظ',
    desc: 'هیچ تصویری فشرده یا تغییر اندازه نمی‌شود',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Shield,
    title: 'خروجی ZIP و PDF',
    desc: 'دانلود سریع با فشرده‌سازی بهینه',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardClientPage() {
  const { images } = useWatermarkStore();

  return (
    <DashboardLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto py-8 sm:py-12 space-y-10"
      >
        {/* Hero */}
        <motion.div variants={item} className="text-center space-y-5">
          <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-gradient-to-br from-primary to-violet-600 shadow-[0_8px_32px_rgba(97,114,243,0.4)] mx-auto">
            <Droplets className="size-9 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">
              <span className="gradient-text">واترمارکر</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
              استودیوی حرفه‌ای افزودن واترمارک به تصاویر
              با پراکندگی هوشمند و خروجی با کیفیت بالا
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/watermark">
              <Button
                variant="brand"
                size="lg"
                className="rounded-2xl h-12 px-8 text-base font-bold gap-2 shadow-[0_4px_20px_rgba(97,114,243,0.35)]"
              >
                <Sparkles className="size-5" />
                {images.length > 0
                  ? `ادامه کار (${images.length} تصویر)`
                  : 'شروع کنید'}
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 hover:border-primary/30 transition-colors"
              >
                <div
                  className={`size-10 rounded-xl ${f.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`size-5 ${f.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick tip */}
        <motion.div
          variants={item}
          className="rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4 text-sm text-center text-muted-foreground leading-relaxed"
        >
          💡 <strong className="text-foreground">نکته:</strong> می‌توانید تا ۱۰۰ تصویر را به صورت همزمان بارگذاری کرده و با یک کلیک خروجی ZIP دریافت کنید.
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
