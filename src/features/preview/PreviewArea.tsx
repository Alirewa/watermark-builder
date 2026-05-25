// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, clamp } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function PreviewArea() {
  const { uploads, watermarkConfig } = useAppStore();
  const [zoom, setZoom] = useState(1);
  const [showWatermark, setShowWatermark] = useState(true);
  const currentFile = uploads.find((u) => u.status !== 'error');

  const adjustZoom = (delta: number) => {
    setZoom((z) => clamp(z + delta, 0.25, 4));
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">پیش‌نمایش</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => adjustZoom(-0.25)}>
            <ZoomOut className="size-3.5" />
          </Button>
          <span className="text-xs w-10 text-center font-medium">
            {Math.round(zoom * 100)}٪
          </span>
          <Button variant="ghost" size="icon-sm" onClick={() => adjustZoom(0.25)}>
            <ZoomIn className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setZoom(1)}>
            <RotateCcw className="size-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowWatermark((v) => !v)}
          >
            {showWatermark ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          </Button>
          <Button variant="outline" size="sm" className="ms-1">
            <Download className="size-3.5" />
            دانلود
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <GlassCard className="flex-1 flex items-center justify-center overflow-hidden min-h-[300px] relative bg-[url('/placeholder-bg.svg')] bg-repeat">
        {!currentFile ? (
          <EmptyPreview />
        ) : (
          <motion.div
            animate={{ scale: zoom }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="relative select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentFile.preview ?? currentFile.url}
              alt="Preview"
              className="max-w-full max-h-[500px] rounded-xl shadow-float object-contain"
              draggable={false}
            />

            {/* Watermark overlay */}
            {showWatermark && watermarkConfig.type === 'text' && watermarkConfig.text && (
              <div
                className={cn(
                  'absolute inset-0 flex pointer-events-none',
                  getPositionClass(watermarkConfig.position)
                )}
              >
                <span
                  style={{
                    opacity: watermarkConfig.opacity,
                    fontSize: watermarkConfig.fontSize,
                    color: watermarkConfig.color,
                    fontFamily: watermarkConfig.fontFamily,
                    transform: `rotate(${watermarkConfig.rotation}deg) scale(${watermarkConfig.scale})`,
                    textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                  }}
                  className="font-bold select-none"
                >
                  {watermarkConfig.text}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center gap-4 text-muted-foreground p-10">
      <div className="size-20 rounded-3xl bg-muted/50 flex items-center justify-center">
        <Eye className="size-8 opacity-40" />
      </div>
      <div className="text-center">
        <p className="font-medium">هنوز تصویری انتخاب نشده</p>
        <p className="text-sm opacity-70 mt-1">برای مشاهده پیش‌نمایش، ابتدا یک تصویر آپلود کنید</p>
      </div>
    </div>
  );
}

function getPositionClass(position: string): string {
  const map: Record<string, string> = {
    'top-right': 'items-start justify-end p-4',
    'top-left': 'items-start justify-start p-4',
    'top-center': 'items-start justify-center pt-4',
    center: 'items-center justify-center',
    'bottom-right': 'items-end justify-end p-4',
    'bottom-left': 'items-end justify-start p-4',
    'bottom-center': 'items-end justify-center pb-4',
  };
  return map[position] ?? 'items-center justify-center';
}
