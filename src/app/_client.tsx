// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Droplets, ArrowLeft, ArrowRight, Sparkles, Shield, Zap, Images } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { useT } from '@/hooks/useT';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardClientPage() {
  const { images } = useWatermarkStore();
  const { t, lang } = useT();
  const isRTL = lang === 'fa';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const featureIcons = [Images, Sparkles, Zap, Shield];
  const featureColors = [
    { text: 'text-blue-500',    bg: 'bg-blue-500/10' },
    { text: 'text-violet-500',  bg: 'bg-violet-500/10' },
    { text: 'text-amber-500',   bg: 'bg-amber-500/10' },
    { text: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

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
              <span className="gradient-text">{t.home.appName}</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {t.home.subtitle}
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
                  ? `${t.home.continueBtn} (${images.length})`
                  : t.home.startBtn}
                <Arrow className="size-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.home.features.map((f, i) => {
            const Icon = featureIcons[i];
            const c = featureColors[i];
            return (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 hover:border-primary/30 transition-colors"
              >
                <div className={`size-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`size-5 ${c.text}`} />
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tip */}
        <motion.div
          variants={item}
          className="rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4 text-sm text-center text-muted-foreground leading-relaxed"
        >
          💡 <strong className="text-foreground">{isRTL ? 'نکته:' : 'Tip:'}</strong>{' '}
          {t.home.tip}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
