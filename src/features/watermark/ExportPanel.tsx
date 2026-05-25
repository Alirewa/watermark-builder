// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileArchive, FileText, Download, ChevronDown,
  Image as ImageIcon, Layers, Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { useExportStore } from '@/store/useExportStore';
import { exportAsZip } from '@/utils/exportZip';
import { exportAsPdf } from '@/utils/exportPdf';
import { cn } from '@/lib/utils';
import type { WatermarkCanvasAPI } from '@/lib/canvas/useWatermarkCanvas';

interface ExportPanelProps {
  api: WatermarkCanvasAPI;
}

export function ExportPanel({ api }: ExportPanelProps) {
  const { images, activeImageId } = useWatermarkStore();
  const exportStore = useExportStore();

  const [showOptions, setShowOptions] = useState(false);
  const [pdfLayout, setPdfLayout] = useState<1 | 2 | 4>(1);
  const [zipCompression, setZipCompression] = useState(true);

  const hasImages = images.length > 0;
  const multipleImages = images.length > 1;

  /* ── Single-image download ──────────────────────────────── */
  const handleSingleDownload = () => {
    const dataUrl = api.getExportDataUrl(0.95);
    if (!dataUrl) return;
    const img = images.find((i) => i.id === activeImageId);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = img ? `واترمارک-${img.name}` : 'watermarked.jpg';
    a.click();
  };

  /* ── Batch → gather results ─────────────────────────────── */
  const gatherBatchResults = async (): Promise<Array<{ name: string; dataUrl: string }> | null> => {
    const results = await api.processAllImages();
    exportStore.setProcessed(results.length);
    return results.map((r) => ({ name: r.name, dataUrl: r.dataUrl }));
  };

  /* ── ZIP export ─────────────────────────────────────────── */
  const handleZipExport = async () => {
    if (exportStore.status === 'processing') return;
    exportStore.startExport('zip', images.length);
    try {
      const items = multipleImages ? await gatherBatchResults() : null;
      const exportItems = items ?? (() => {
        const dataUrl = api.getExportDataUrl(0.95);
        const img = images.find((i) => i.id === activeImageId);
        return dataUrl ? [{ name: img?.name ?? 'image', dataUrl }] : [];
      })();

      if (!exportItems.length) throw new Error('هیچ تصویری برای خروجی یافت نشد');

      await exportAsZip(exportItems, {
        compression: zipCompression ? 'DEFLATE' : 'STORE',
        compressionLevel: 6,
        onProgress: (pct, label) => exportStore.updateProgress(pct, label),
      });
      exportStore.finishExport();
    } catch (e) {
      exportStore.failExport(e instanceof Error ? e.message : 'خطای ناشناخته');
    }
  };

  /* ── PDF export ─────────────────────────────────────────── */
  const handlePdfExport = async () => {
    if (exportStore.status === 'processing') return;
    exportStore.startExport('pdf', images.length);
    try {
      const items = multipleImages ? await gatherBatchResults() : null;
      const exportItems = items ?? (() => {
        const dataUrl = api.getExportDataUrl(0.95);
        const img = images.find((i) => i.id === activeImageId);
        return dataUrl ? [{ name: img?.name ?? 'image', dataUrl }] : [];
      })();

      if (!exportItems.length) throw new Error('هیچ تصویری برای خروجی یافت نشد');

      await exportAsPdf(exportItems, {
        quality: 0.92,
        onProgress: (pct, label) => exportStore.updateProgress(pct, label),
      });
      exportStore.finishExport();
    } catch (e) {
      exportStore.failExport(e instanceof Error ? e.message : 'خطای ناشناخته');
    }
  };

  return (
    <div className="space-y-2">
      {/* Section title */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          خروجی
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowOptions((v) => !v)}
          className={cn('rounded-lg transition-transform', showOptions && 'rotate-180')}
        >
          <Settings2 className="size-3.5" />
        </Button>
      </div>

      {/* Options panel */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-3 space-y-3 rounded-xl border border-border/60">
              {/* Compression toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-1.5">
                  <FileArchive className="size-3.5 text-muted-foreground" />
                  فشرده‌سازی ZIP
                </Label>
                <Switch
                  checked={zipCompression}
                  onCheckedChange={setZipCompression}
                  id="zip-compression"
                />
              </div>

              <Separator />

              {/* PDF layout */}
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5">
                  <Layers className="size-3.5 text-muted-foreground" />
                  چیدمان PDF
                </Label>
                <div className="grid grid-cols-3 gap-1">
                  {([1, 2, 4] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPdfLayout(n)}
                      className={cn(
                        'text-[10px] py-1.5 rounded-lg border transition-all font-medium',
                        pdfLayout === n
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      )}
                    >
                      {n === 1 ? '۱ در صفحه' : n === 2 ? '۲ در صفحه' : '۴ در صفحه'}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export buttons */}
      <div className="grid grid-cols-1 gap-2">
        {/* Single download */}
        <Button
          variant="brand"
          size="sm"
          onClick={handleSingleDownload}
          disabled={!hasImages || exportStore.status === 'processing'}
          className="w-full rounded-xl justify-start gap-2 h-9"
        >
          <Download className="size-3.5 shrink-0" />
          <span className="flex-1 text-start text-xs">
            {multipleImages ? 'دانلود تصویر فعال' : 'دانلود تصویر'}
          </span>
          <ImageIcon className="size-3 opacity-60" />
        </Button>

        {/* ZIP */}
        <SimpleTooltip content={`خروجی ZIP از ${images.length} تصویر`}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZipExport}
            disabled={!hasImages || exportStore.status === 'processing'}
            className="w-full rounded-xl justify-start gap-2 h-9"
          >
            <FileArchive className="size-3.5 shrink-0 text-amber-500" />
            <span className="flex-1 text-start text-xs">
              خروجی ZIP
              {multipleImages && (
                <span className="text-muted-foreground"> ({images.length})</span>
              )}
            </span>
          </Button>
        </SimpleTooltip>

        {/* PDF */}
        <SimpleTooltip content={`خروجی PDF از ${images.length} تصویر`}>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePdfExport}
            disabled={!hasImages || exportStore.status === 'processing'}
            className="w-full rounded-xl justify-start gap-2 h-9"
          >
            <FileText className="size-3.5 shrink-0 text-rose-500" />
            <span className="flex-1 text-start text-xs">
              خروجی PDF
              {multipleImages && (
                <span className="text-muted-foreground"> ({images.length})</span>
              )}
            </span>
          </Button>
        </SimpleTooltip>
      </div>

      {/* Image count hint */}
      {multipleImages && (
        <p className="text-[10px] text-muted-foreground text-center py-0.5">
          <span className="font-medium text-foreground">{images.length}</span> تصویر در صف پردازش
        </p>
      )}
    </div>
  );
}
