'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, FileArchive, FileText, Loader2, X } from 'lucide-react';
import { useExportStore } from '@/store/useExportStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ExportProgressModal() {
  const {
    status, format, progress, label, error,
    totalImages, processedImages, resetExport,
  } = useExportStore();

  const isVisible = status !== 'idle';

  // Auto-dismiss after success
  useEffect(() => {
    if (status === 'done') {
      const t = setTimeout(() => resetExport(), 4000);
      return () => clearTimeout(t);
    }
  }, [status, resetExport]);

  const FormatIcon = format === 'zip' ? FileArchive : format === 'pdf' ? FileText : Loader2;

  const progressColor =
    status === 'done' ? 'bg-emerald-500' :
    status === 'error' ? 'bg-destructive' :
    'bg-primary';

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={status !== 'processing' ? resetExport : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm glass rounded-2xl border border-border shadow-float p-6">

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  {/* Animated icon */}
                  <div className={cn(
                    'size-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors',
                    status === 'done' ? 'bg-emerald-500/15' :
                    status === 'error' ? 'bg-destructive/15' :
                    'bg-primary/15'
                  )}>
                    {status === 'done' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                      >
                        <CheckCircle2 className="size-5 text-emerald-500" />
                      </motion.div>
                    ) : status === 'error' ? (
                      <XCircle className="size-5 text-destructive" />
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="size-5 text-primary" />
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {status === 'processing' && (
                        format === 'zip' ? 'در حال تهیه خروجی ZIP' :
                        format === 'pdf' ? 'در حال تهیه خروجی PDF' :
                        'در حال پردازش'
                      )}
                      {status === 'done' && 'خروجی‌گیری کامل شد'}
                      {status === 'error' && 'خطا در خروجی‌گیری'}
                    </p>
                    {totalImages > 1 && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {processedImages} از {totalImages} تصویر
                      </p>
                    )}
                  </div>
                </div>

                {status !== 'processing' && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={resetExport}
                    className="shrink-0 -mt-1 -me-1 rounded-lg"
                  >
                    <X className="size-3.5" />
                  </Button>
                )}
              </div>

              {/* Progress bar */}
              <div className="relative h-2.5 rounded-full bg-muted overflow-hidden mb-3">
                <motion.div
                  className={cn('absolute inset-y-0 start-0 rounded-full', progressColor)}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
                {/* Shimmer on active */}
                {status === 'processing' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-sweep" />
                )}
              </div>

              {/* Label */}
              <motion.p
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'text-xs text-center',
                  status === 'done' ? 'text-emerald-600 dark:text-emerald-400 font-medium' :
                  status === 'error' ? 'text-destructive font-medium' :
                  'text-muted-foreground'
                )}
              >
                {error ?? label}
              </motion.p>

              {/* Percentage */}
              {status === 'processing' && (
                <p className="text-[10px] text-muted-foreground text-center mt-1 tabular-nums">
                  {progress}٪
                </p>
              )}

              {/* Action buttons on error/done */}
              {(status === 'done' || status === 'error') && (
                <Button
                  variant={status === 'done' ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={resetExport}
                  className="mt-4 w-full rounded-xl text-xs"
                >
                  {status === 'done' ? 'بستن' : 'تلاش مجدد'}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
