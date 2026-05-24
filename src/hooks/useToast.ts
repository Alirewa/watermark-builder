'use client';

import { useAppStore } from '@/store/useAppStore';
import type { ToastType } from '@/types';

export function useToast() {
  const { addToast, removeToast, clearToasts, toasts } = useAppStore();

  const toast = {
    success: (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
    custom: (type: ToastType, title: string, description?: string, duration?: number) =>
      addToast({ type, title, description, duration }),
  };

  return { toast, toasts, removeToast, clearToasts };
}
