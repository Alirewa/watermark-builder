'use client';

import { motion } from 'framer-motion';
import {
  Undo2, Redo2, ZoomIn, ZoomOut, Maximize2,
  Trash2, Wand2, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import type { WatermarkCanvasAPI } from '@/lib/canvas/useWatermarkCanvas';

interface CanvasToolbarProps {
  api: WatermarkCanvasAPI;
  onUndo: () => void;
  onRedo: () => void;
}

export function CanvasToolbar({ api, onUndo, onRedo }: CanvasToolbarProps) {
  const { canUndo, canRedo, compareMode, setCompareMode } = useWatermarkStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 px-3 py-2 glass rounded-2xl border border-border flex-wrap"
    >
      {/* Undo / Redo */}
      <SimpleTooltip content="بازگشت (Ctrl+Z)">
        <Button
          variant="ghost" size="icon-sm"
          onClick={onUndo} disabled={!canUndo}
          className="rounded-lg"
          aria-label="بازگشت"
        >
          <Undo2 className="size-3.5" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="تکرار (Ctrl+Y)">
        <Button
          variant="ghost" size="icon-sm"
          onClick={onRedo} disabled={!canRedo}
          className="rounded-lg"
          aria-label="تکرار"
        >
          <Redo2 className="size-3.5" />
        </Button>
      </SimpleTooltip>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Zoom */}
      <SimpleTooltip content="بزرگ‌نمایی">
        <Button variant="ghost" size="icon-sm" onClick={api.zoomIn} className="rounded-lg" aria-label="بزرگ‌نمایی">
          <ZoomIn className="size-3.5" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="کوچک‌نمایی">
        <Button variant="ghost" size="icon-sm" onClick={api.zoomOut} className="rounded-lg" aria-label="کوچک‌نمایی">
          <ZoomOut className="size-3.5" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="اندازه اصلی">
        <Button variant="ghost" size="icon-sm" onClick={api.resetZoom} className="rounded-lg" aria-label="اندازه اصلی">
          <Maximize2 className="size-3.5" />
        </Button>
      </SimpleTooltip>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Watermark */}
      <SimpleTooltip content="اعمال واترمارک (Ctrl+Enter)">
        <Button
          variant="ghost" size="icon-sm"
          onClick={api.applyWatermark}
          className="rounded-lg text-primary"
          aria-label="اعمال واترمارک"
        >
          <Wand2 className="size-3.5" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="حذف واترمارک (Delete)">
        <Button
          variant="ghost" size="icon-sm"
          onClick={api.removeWatermark}
          className="rounded-lg text-muted-foreground hover:text-destructive"
          aria-label="حذف واترمارک"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </SimpleTooltip>

      <Separator orientation="vertical" className="h-5 mx-0.5" />

      {/* Compare */}
      <SimpleTooltip content={compareMode ? 'بستن مقایسه' : 'مقایسه قبل/بعد'}>
        <Button
          variant={compareMode ? 'default' : 'ghost'}
          size="icon-sm"
          onClick={() => setCompareMode(!compareMode)}
          className="rounded-lg"
          aria-label="مقایسه"
        >
          <SlidersHorizontal className="size-3.5" />
        </Button>
      </SimpleTooltip>
    </motion.div>
  );
}
