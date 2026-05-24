'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, Layers, Image, Palette } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';

const actions = [
  {
    label: 'آپلود تصویر',
    description: 'بارگذاری تصاویر جدید',
    icon: Upload,
    href: '/upload',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'اعمال واترمارک',
    description: 'افزودن واترمارک به تصاویر',
    icon: Layers,
    href: '/watermark',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    label: 'پیش‌نمایش',
    description: 'مشاهده نتیجه نهایی',
    icon: Image,
    href: '/preview',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    label: 'قالب‌ها',
    description: 'انتخاب از قالب‌های آماده',
    icon: Palette,
    href: '/templates',
    gradient: 'from-orange-500 to-rose-500',
  },
];

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">دسترسی سریع</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={action.href}>
                <GlassCard className="group p-4 cursor-pointer floating-card hover:border-primary/30 transition-all">
                  <div
                    className={`size-9 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="size-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
