'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, Image as ImageIcon, QrCode,
  MapPin, BookMarked, ChevronLeft, ChevronRight,
  Keyboard,
} from 'lucide-react';

import { useWatermarkCanvas } from '@/lib/canvas/useWatermarkCanvas';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { useHistory } from '@/hooks/useHistory';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useIsMobile } from '@/hooks/useMediaQuery';

import { WatermarkCanvas } from './canvas/WatermarkCanvas';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { CompareSlider } from './canvas/CompareSlider';
import { TextWatermarkPanel } from './panels/TextWatermarkPanel';
import { ImageWatermarkPanel } from './panels/ImageWatermarkPanel';
import { QRWatermarkPanel } from './panels/QRWatermarkPanel';
import { PositionPanel } from './panels/PositionPanel';
import { TemplatesPanel } from './panels/TemplatesPanel';
import { ExportPanel } from './ExportPanel';
import { ImageGrid } from '@/features/upload/ImageGrid';

import { GlassCard } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MODE_ICONS = {
  text: Type,
  image: ImageIcon,
  qr: QrCode,
} as const;

const MODE_LABELS = {
  text: 'متن',
  image: 'تصویر',
  qr: 'QR کد',
} as const;

/* ─── Keyboard shortcuts legend ─────────────────────────────── */
const SHORTCUTS = [
  { keys: 'Ctrl+Z', label: 'بازگشت' },
  { keys: 'Ctrl+Y', label: 'تکرار' },
  { keys: 'Ctrl+Enter', label: 'اعمال واترمارک' },
  { keys: 'Ctrl+S', label: 'دانلود' },
  { keys: 'Delete', label: 'حذف واترمارک' },
  { keys: '←→↑↓', label: 'جابجایی با کیبورد' },
];

export function WatermarkEditor() {
  const api = useWatermarkCanvas();
  const store = useWatermarkStore();
  const { mode, setMode, compareMode, setCompareMode, activeImageId, images } = store;
  const isMobile = useIsMobile();

  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [compareSnapshot, setCompareSnapshot] = useState<string | null>(null);

  /* ── History ─────────────────────────────────────────── */
  const { undo, redo } = useHistory(api.loadFromJson);

  /* ── Keyboard shortcuts ──────────────────────────────── */
  useKeyboard({
    'mod+z': undo,
    'mod+y': redo,
    'mod+shift+z': redo,
    'mod+enter': () => api.applyWatermark(),
    'mod+s': () => {
      const dataUrl = api.getExportDataUrl(0.95);
      if (!dataUrl) return;
      const img = images.find((i) => i.id === activeImageId);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = img ? `wm-${img.name}` : 'watermarked.jpg';
      a.click();
    },
    'delete': () => api.removeWatermark(),
  });

  /* ── Hydrate store ───────────────────────────────────── */
  useEffect(() => {
    store.hydrate();
  }, []); // eslint-disable-line

  /* ── Compare mode: capture snapshot ─────────────────── */
  useEffect(() => {
    if (compareMode) {
      const snap = api.getExportDataUrl(0.85);
      setCompareSnapshot(snap);
    } else {
      setCompareSnapshot(null);
    }
  }, [compareMode]); // eslint-disable-line

  const activeImage = images.find((i) => i.id === activeImageId);

  return (
    <div className="flex h-[calc(100vh-var(--header-height,64px)-2rem)] gap-3 min-h-0">

      {/* ─── LEFT PANEL: Image list ──────────────────── */}
      <motion.div
        animate={{ width: leftCollapsed ? 40 : isMobile ? '100%' : 220 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
        className={cn(
          'shrink-0 flex flex-col overflow-hidden',
          isMobile && leftCollapsed && 'hidden'
        )}
      >
        <GlassCard className="flex-1 flex flex-col overflow-hidden p-3 min-h-0">
          {leftCollapsed ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setLeftCollapsed(false)}
              className="mx-auto mt-1"
            >
              <ChevronLeft className="size-4" />
            </Button>
          ) : (
            <>
              <ImageGrid />
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setLeftCollapsed(true)}
                  className="mt-2 mx-auto text-muted-foreground"
                >
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </>
          )}
        </GlassCard>
      </motion.div>

      {/* ─── CENTER: Canvas ──────────────────────────── */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Canvas */}
        <div className="flex-1 relative min-h-0">
          {compareMode && compareSnapshot && activeImage ? (
            <CompareSlider
              originalUrl={activeImage.url}
              watermarkedDataUrl={compareSnapshot}
              className="w-full h-full"
            />
          ) : (
            <WatermarkCanvas
              api={api}
              className="w-full h-full glass border border-border"
            />
          )}
        </div>

        {/* Toolbar */}
        <CanvasToolbar api={api} onUndo={undo} onRedo={redo} />

        {/* Shortcuts hint */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShortcuts((v) => !v)}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Keyboard className="size-3" />
            میانبرهای کیبورد
          </button>
        </div>

        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                {SHORTCUTS.map((s) => (
                  <div key={s.keys} className="flex items-center gap-2">
                    <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border shrink-0">
                      {s.keys}
                    </kbd>
                    <span className="text-[10px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── RIGHT PANEL: Controls ───────────────────── */}
      <motion.div
        animate={{ width: rightCollapsed ? 40 : isMobile ? '100%' : 300 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
        className={cn(
          'shrink-0 flex flex-col overflow-hidden',
          isMobile && rightCollapsed && 'hidden'
        )}
      >
        <GlassCard className="flex-1 flex flex-col overflow-hidden min-h-0">
          {rightCollapsed ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setRightCollapsed(false)}
              className="mx-auto mt-3"
            >
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <>
              {/* Panel collapse toggle */}
              {!isMobile && (
                <div className="flex justify-end px-3 pt-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setRightCollapsed(true)}
                    className="text-muted-foreground rounded-lg"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </div>
              )}

              <ScrollArea className="flex-1 px-3 pb-3">
                <div className="space-y-4">
                  {/* Mode selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      نوع واترمارک
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(Object.keys(MODE_ICONS) as Array<keyof typeof MODE_ICONS>).map((m) => {
                        const Icon = MODE_ICONS[m];
                        return (
                          <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={cn(
                              'flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all',
                              mode === m
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/40 hover:bg-accent text-muted-foreground'
                            )}
                          >
                            <Icon className="size-4" />
                            {MODE_LABELS[m]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Mode-specific panel */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mode === 'text'  && <TextWatermarkPanel />}
                      {mode === 'image' && <ImageWatermarkPanel />}
                      {mode === 'qr'    && <QRWatermarkPanel />}
                    </motion.div>
                  </AnimatePresence>

                  <Separator />

                  {/* Position */}
                  <PositionPanel />

                  <Separator />

                  {/* Templates */}
                  <TemplatesPanel />

                  <Separator />

                  {/* Export */}
                  <ExportPanel api={api} />
                </div>
              </ScrollArea>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
