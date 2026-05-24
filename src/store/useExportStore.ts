'use client';

import { create } from 'zustand';

export type ExportStatus = 'idle' | 'processing' | 'done' | 'error';
export type ExportFormat = 'zip' | 'pdf' | 'single';

export interface ExportState {
  status: ExportStatus;
  format: ExportFormat | null;
  progress: number;        // 0–100
  label: string;
  error: string | null;
  totalImages: number;
  processedImages: number;

  /* Actions */
  startExport: (format: ExportFormat, total: number) => void;
  updateProgress: (pct: number, label: string) => void;
  setProcessed: (n: number) => void;
  finishExport: () => void;
  failExport: (msg: string) => void;
  resetExport: () => void;
}

export const useExportStore = create<ExportState>()((set) => ({
  status: 'idle',
  format: null,
  progress: 0,
  label: '',
  error: null,
  totalImages: 0,
  processedImages: 0,

  startExport: (format, total) =>
    set({ status: 'processing', format, progress: 0, label: 'در حال شروع…', error: null, totalImages: total, processedImages: 0 }),

  updateProgress: (pct, label) =>
    set({ progress: pct, label }),

  setProcessed: (n) => set({ processedImages: n }),

  finishExport: () =>
    set((s) => ({
      status: 'done',
      progress: 100,
      label: s.format === 'zip'
        ? 'فایل ZIP آماده دانلود است ✓'
        : s.format === 'pdf'
          ? 'خروجی PDF آماده دانلود است ✓'
          : 'دانلود انجام شد ✓',
    })),

  failExport: (msg) =>
    set({ status: 'error', error: msg, label: 'خطا در خروجی‌گیری' }),

  resetExport: () =>
    set({ status: 'idle', format: null, progress: 0, label: '', error: null, totalImages: 0, processedImages: 0 }),
}));
