// Developed by @Alirewa — https://github.com/Alirewa
'use client';

'use client';

import { motion } from 'framer-motion';
import { Images, Download, Layers, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';
import { toPersianDigits } from '@/lib/utils';

const stats = [
  {
    id: 'processed',
    label: 'تصاویر پردازش‌شده',
    value: 1248,
    suffix: '',
    icon: Images,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    trend: '+۱۲٪',
    trendUp: true,
  },
  {
    id: 'watermarks',
    label: 'واترمارک اعمال‌شده',
    value: 943,
    suffix: '',
    icon: Layers,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    trend: '+۸٪',
    trendUp: true,
  },
  {
    id: 'downloads',
    label: 'دانلود انجام‌شده',
    value: 2041,
    suffix: '',
    icon: Download,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    trend: '+۲۳٪',
    trendUp: true,
  },
  {
    id: 'remaining',
    label: 'باقیمانده ماهانه',
    value: 57,
    suffix: '٪',
    icon: TrendingUp,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    trend: '-۴۳٪',
    trendUp: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.3 } },
};

export function StatsCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.id} variants={itemVariants}>
            <GlassCard className="p-5 floating-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`size-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.trendUp
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : 'text-red-600 dark:text-red-400 bg-red-500/10'
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums">
                {toPersianDigits(stat.value.toLocaleString())}
                {stat.suffix}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
