// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { ToastType } from '@/types';
import { cn } from '@/lib/utils';

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  error: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
};

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  return (
    <div
      className="fixed bottom-4 start-4 z-[100] flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: 'min(380px, calc(100vw - 32px))' }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.9 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl',
                'border glass shadow-glass backdrop-blur-xl',
                styles[toast.type]
              )}
            >
              <Icon className="size-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs mt-0.5 opacity-80">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
