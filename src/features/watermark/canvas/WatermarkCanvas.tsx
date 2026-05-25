// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { motion } from 'framer-motion';
import { Loader2, ImageIcon } from 'lucide-react';
import type { WatermarkCanvasAPI } from '@/lib/canvas/useWatermarkCanvas';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { cn } from '@/lib/utils';

interface WatermarkCanvasProps {
  api: WatermarkCanvasAPI;
  className?: string;
}

export function WatermarkCanvas({ api, className }: WatermarkCanvasProps) {
  const { images, activeImageId, isProcessing } = useWatermarkStore();
  const hasImage = images.some((i) => i.id === activeImageId);

  return (
    <div className={cn('relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden', className)}>
      {/* Checkerboard background */}
      <div
        className="absolute inset-0 bg-[url('/placeholder-bg.svg')] bg-repeat opacity-30 dark:opacity-10"
        aria-hidden
      />

      {/* Fabric canvas container */}
      <div
        ref={api.mountRef}
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-300',
          !hasImage && 'opacity-0 pointer-events-none'
        )}
      />

      {/* Empty state */}
      {!hasImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="size-20 rounded-3xl bg-muted/60 flex items-center justify-center"
          >
            <ImageIcon className="size-9" />
          </motion.div>
          <div className="text-center">
            <p className="font-semibold text-sm">تصویری انتخاب نشده</p>
            <p className="text-xs mt-1 opacity-70">از پانل چپ یک تصویر آپلود کنید</p>
          </div>
        </div>
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">در حال پردازش...</p>
          </div>
        </div>
      )}

      {/* Ready indicator */}
      {api.isReady && hasImage && (
        <div className="absolute top-3 end-3 z-10">
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 border border-border text-[10px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            زنده
          </div>
        </div>
      )}
    </div>
  );
}
