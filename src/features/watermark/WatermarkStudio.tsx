'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  FileArchive,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Images,
  Download,
  Eye,
  Zap,
  Info,
  Tag,
  Sparkles,
} from 'lucide-react';

import { cn, isValidImageType } from '@/lib/utils';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { useExportStore } from '@/store/useExportStore';
import { useToast } from '@/hooks/useToast';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  batchApplyWatermarks,
  applyTemplateWatermarks,
} from '@/lib/watermark/randomPlacement';
import { exportAsZip } from '@/utils/exportZip';
import { exportAsPdf } from '@/utils/exportPdf';
import {
  PLACEMENT_TEMPLATES,
  type PlacementTemplate,
  type WatermarkOptions,
} from '@/types/watermark';

/* ─── Constants ──────────────────────────────────────────────── */
const SIZE_MAP: Record<string, number> = {
  small:  0.12,
  medium: 0.19,
  large:  0.28,
};

/* ─── Template Visual Card ───────────────────────────────────── */
function TemplateCard({
  template,
  isSelected,
  onClick,
}: {
  template: PlacementTemplate;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-2.5 rounded-2xl border-2 transition-all',
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border/60 hover:border-primary/40 hover:bg-muted/50'
      )}
    >
      {/* Dot layout preview */}
      <div className="relative w-full aspect-[3/2] rounded-xl bg-muted/70 overflow-hidden">
        {template.positions.map((pos, i) => (
          <div
            key={i}
            className={cn(
              'absolute size-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm',
              isSelected ? 'bg-primary' : 'bg-muted-foreground/50'
            )}
            style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
          />
        ))}
      </div>
      <span
        className={cn(
          'text-[11px] font-bold',
          isSelected ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {template.label}
      </span>
    </button>
  );
}

/* ─── Section Card ───────────────────────────────────────────── */
function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Main Studio ────────────────────────────────────────────── */
export function WatermarkStudio() {
  const store = useWatermarkStore();
  const { images, addImages, removeImage } = store;
  const exportStore = useExportStore();
  const { toast } = useToast();

  /* ── Local state ───────────────────────────────────────────── */
  const [logoUrl, setLogoUrl] = useState('');
  const [logoName, setLogoName] = useState('');
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [quality, setQuality] = useState(0.92);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [baseName, setBaseName] = useState('');
  const [templateId, setTemplateId] = useState('triangle');
  const [wmOpacity, setWmOpacity] = useState(0.45);
  const [wmSize, setWmSize] = useState<'small' | 'medium' | 'large'>('medium');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  /* ── Derived ───────────────────────────────────────────────── */
  const isProcessing = exportStore.status === 'processing';
  const canProcess = images.length > 0 && !!logoUrl;
  const wmOptions: WatermarkOptions = {
    templateId,
    opacity: wmOpacity,
    sizeRatio: SIZE_MAP[wmSize],
  };

  /* Sync logoUrl to store */
  useEffect(() => {
    if (logoUrl) store.setLogoUrl(logoUrl);
  }, [logoUrl]); // eslint-disable-line

  /* Restore logo from store on mount */
  useEffect(() => {
    if (store.imageConfig.url && !logoUrl) setLogoUrl(store.imageConfig.url);
  }, []); // eslint-disable-line

  /* ── Image handlers ────────────────────────────────────────── */
  const handleImages = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter((f) => isValidImageType(f.type));
      if (!valid.length) {
        toast.error('فرمت نامعتبر', 'فقط JPG، PNG و WebP پشتیبانی می‌شوند');
        return;
      }
      addImages(valid);
      setProcessedCount(0);
      setPreviewUrls([]);
      toast.success(`${valid.length} تصویر اضافه شد`);
    },
    [addImages, toast]
  );

  /* ── Logo handlers ─────────────────────────────────────────── */
  const handleLogo = useCallback(
    (file: File) => {
      if (!isValidImageType(file.type) && file.type !== 'image/svg+xml') {
        toast.error('فرمت نامعتبر', 'PNG، SVG یا JPG مجاز است');
        return;
      }
      if (logoUrl.startsWith('blob:')) URL.revokeObjectURL(logoUrl);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setLogoName(file.name);
      setPreviewUrls([]);
      setProcessedCount(0);
    },
    [logoUrl, toast]
  );

  const removeLogo = useCallback(() => {
    if (logoUrl.startsWith('blob:')) URL.revokeObjectURL(logoUrl);
    setLogoUrl('');
    setLogoName('');
    setPreviewUrls([]);
  }, [logoUrl]);

  /* ── Preview — first 3 images ──────────────────────────────── */
  const handlePreview = useCallback(async () => {
    if (!canProcess) return;
    setIsPreviewLoading(true);
    const toPreview = images.slice(0, 3);
    try {
      const urls = await Promise.all(
        toPreview.map((img) =>
          applyTemplateWatermarks(img.url, logoUrl, wmOptions, quality)
        )
      );
      setPreviewUrls(urls);
      setShowPreviewModal(true);
    } catch {
      toast.error('خطا در پیش‌نمایش');
    } finally {
      setIsPreviewLoading(false);
    }
  }, [canProcess, images, logoUrl, wmOptions, quality, toast]);

  /* ── Export ────────────────────────────────────────────────── */
  const runExport = useCallback(
    async (format: 'zip' | 'pdf') => {
      if (!canProcess || isProcessing) return;

      exportStore.startExport(format, images.length);
      setProcessedCount(0);

      try {
        const results = await batchApplyWatermarks(
          images,
          logoUrl,
          wmOptions,
          quality,
          (done, total) => {
            setProcessedCount(done);
            exportStore.updateProgress(
              total > 0 ? Math.round((done / total) * 80) : 0,
              `پردازش تصویر ${done} از ${total}...`
            );
          }
        );

        exportStore.updateProgress(85, 'در حال فشرده‌سازی...');
        const items = results.map((r) => ({ name: r.name, dataUrl: r.dataUrl }));
        const title = baseName || 'واترمارک‌ها';

        if (format === 'zip') {
          await exportAsZip(items, {
            compression: 'DEFLATE',
            compressionLevel: 6,
            baseName: baseName || undefined,
            onProgress: (pct, label) =>
              exportStore.updateProgress(85 + Math.round(pct * 0.15), label),
          });
        } else {
          await exportAsPdf(items, {
            quality,
            title,
            onProgress: (pct, label) =>
              exportStore.updateProgress(85 + Math.round(pct * 0.15), label),
          });
        }

        exportStore.finishExport();
        setProcessedCount(images.length);
        toast.success(
          'خروجی آماده شد',
          `${images.length} تصویر با واترمارک پردازش شدند`
        );
      } catch (e) {
        exportStore.failExport(e instanceof Error ? e.message : 'خطای ناشناخته');
        toast.error('خطا در پردازش', 'لطفاً دوباره تلاش کنید');
      }
    },
    [canProcess, isProcessing, images, logoUrl, wmOptions, quality, baseName, exportStore, toast]
  );

  /* ═══════════════════════════ RENDER ════════════════════════ */
  return (
    <>
      {/* ── Preview Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showPreviewModal && previewUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.18 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image grid */}
              <div
                className={cn(
                  'grid gap-3',
                  previewUrls.length === 1
                    ? 'grid-cols-1 max-w-2xl mx-auto'
                    : previewUrls.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
                )}
              >
                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`پیش‌نمایش ${i + 1}`}
                      className="w-full object-contain max-h-[68vh]"
                    />
                    <div className="absolute bottom-2 start-2 bg-black/55 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-medium">
                      تصویر {i + 1}
                    </div>
                    <a
                      href={url}
                      download={`preview-${i + 1}.jpg`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2 end-2 size-7 rounded-lg bg-black/55 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                    >
                      <Download className="size-3.5" />
                    </a>
                  </div>
                ))}
              </div>
              {/* Close */}
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute -top-3 -end-3 size-9 rounded-full bg-background border border-border shadow-xl flex items-center justify-center hover:bg-accent transition-colors z-10"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Studio Layout ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">

        {/* ═══ LEFT: Images ════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Image Drop Zone */}
          <motion.div
            animate={isDraggingImages ? { scale: 1.01 } : { scale: 1 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingImages(true); }}
            onDragLeave={() => setIsDraggingImages(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingImages(false);
              handleImages(e.dataTransfer.files);
            }}
            onClick={() => imageInputRef.current?.click()}
            className={cn(
              'relative rounded-3xl border-2 border-dashed cursor-pointer',
              'transition-all duration-300 group',
              images.length > 0
                ? 'px-6 py-5'
                : 'px-8 py-16 flex flex-col items-center justify-center gap-5',
              isDraggingImages
                ? 'border-primary bg-primary/8 shadow-[0_0_0_6px_hsl(var(--primary)/0.08)]'
                : 'border-border hover:border-primary/50 hover:bg-primary/3'
            )}
          >
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImages(e.target.files)}
            />

            {images.length > 0 ? (
              <div className="flex items-center gap-4">
                <motion.div
                  animate={isDraggingImages ? { y: -4 } : { y: 0 }}
                  className={cn(
                    'size-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors',
                    isDraggingImages
                      ? 'bg-primary/20 text-primary'
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  )}
                >
                  <Upload className="size-5" />
                </motion.div>
                <div className="min-w-0">
                  <p className="font-bold text-sm">
                    {isDraggingImages ? 'رها کنید!' : 'تصویر بیشتری اضافه کنید'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    JPG · PNG · WebP — تا ۱۰۰ تصویر همزمان
                  </p>
                </div>
                <div className="ms-auto shrink-0">
                  <Badge className="rounded-xl text-sm font-black px-3 py-1">
                    {images.length}
                  </Badge>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  animate={isDraggingImages ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }}
                  className={cn(
                    'size-24 rounded-3xl flex items-center justify-center transition-colors',
                    isDraggingImages
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Images className="size-11" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-black">
                    {isDraggingImages ? 'رها کنید!' : 'تصاویر خود را اینجا بکشید'}
                  </p>
                  <p className="text-sm text-muted-foreground">یا کلیک کنید برای انتخاب فایل</p>
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Zap className="size-3" />
                      تا ۱۰۰ تصویر همزمان
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground/70">JPG · PNG · WebP</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl pointer-events-none h-9 px-5"
                >
                  <ImageIcon className="size-4" />
                  انتخاب تصاویر
                </Button>
              </>
            )}
          </motion.div>

          {/* Image Grid */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <SectionCard className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">تصاویر انتخاب‌شده</h3>
                      <Badge className="text-xs rounded-xl">{images.length}</Badge>
                    </div>
                    <button
                      onClick={() => {
                        images.forEach((img) => removeImage(img.id));
                        setProcessedCount(0);
                        setPreviewUrls([]);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-destructive/8"
                    >
                      <X className="size-3" />
                      پاک کردن همه
                    </button>
                  </div>

                  <div
                    className="grid gap-2 overflow-y-auto"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                      maxHeight: 260,
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {images.map((img) => {
                        const done =
                          processedCount > 0 &&
                          images.indexOf(img) < processedCount;
                        return (
                          <motion.div
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
                            className="relative group aspect-square"
                          >
                            <div className="w-full h-full rounded-xl overflow-hidden bg-muted ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={img.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            {done && (
                              <div className="absolute inset-0 rounded-xl bg-emerald-500/25 flex items-center justify-center pointer-events-none">
                                <CheckCircle2 className="size-5 text-emerald-500 drop-shadow" />
                              </div>
                            )}
                            <button
                              onClick={() => {
                                removeImage(img.id);
                                setProcessedCount(0);
                              }}
                              className="absolute -top-1.5 -end-1.5 size-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X className="size-2.5" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Progress bar */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Loader2 className="size-3 animate-spin" />
                            در حال پردازش...
                          </span>
                          <span className="font-bold text-primary tabular-nums">
                            {processedCount}/{images.length}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                            animate={{
                              width:
                                images.length > 0
                                  ? `${(processedCount / images.length) * 100}%`
                                  : '0%',
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ RIGHT: Controls ══════════════════════════════════════ */}
        <div className="space-y-4">

          {/* ─── 1. Logo Upload ───────────────────────────────────── */}
          <SectionCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <ImageIcon className="size-3.5 text-violet-500" />
              </div>
              <h3 className="text-sm font-bold">لوگوی واترمارک</h3>
              {!logoUrl ? (
                <span className="ms-auto text-xs text-muted-foreground/60 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-400 inline-block" />
                  ضروری
                </span>
              ) : (
                <span className="ms-auto text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  بارگذاری شد
                </span>
              )}
            </div>

            {logoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted/30">
                <div className="checkerboard" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="لوگو"
                  className="relative w-full h-32 object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs font-medium truncate flex-1">{logoName}</p>
                  <button
                    onClick={removeLogo}
                    className="size-7 rounded-lg bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                animate={isDraggingLogo ? { scale: 1.01 } : { scale: 1 }}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                onDragLeave={() => setIsDraggingLogo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingLogo(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleLogo(f);
                }}
                onClick={() => logoInputRef.current?.click()}
                className={cn(
                  'rounded-2xl border-2 border-dashed cursor-pointer',
                  'flex flex-col items-center justify-center gap-3 p-8 group',
                  'transition-all duration-200',
                  isDraggingLogo
                    ? 'border-primary bg-primary/8'
                    : 'border-border hover:border-primary/50 hover:bg-primary/3'
                )}
              >
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Upload className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">
                    {isDraggingLogo ? 'رها کنید!' : 'لوگوی واترمارک'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">PNG · SVG · JPG</p>
                </div>
              </motion.div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleLogo(e.target.files[0])}
            />
          </SectionCard>

          {/* ─── 2. Placement Template ────────────────────────────── */}
          <SectionCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="size-3.5 text-primary" />
              </div>
              <h3 className="text-sm font-bold">جایگاه واترمارک</h3>
            </div>

            {/* 4 template cards */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {PLACEMENT_TEMPLATES.map((tmpl) => (
                <TemplateCard
                  key={tmpl.id}
                  template={tmpl}
                  isSelected={templateId === tmpl.id}
                  onClick={() => setTemplateId(tmpl.id)}
                />
              ))}
            </div>

            {/* Opacity */}
            <Slider
              label="شفافیت واترمارک"
              showValue
              formatValue={(v) => `${Math.round(v * 100)}٪`}
              min={0.1}
              max={1.0}
              step={0.05}
              value={[wmOpacity]}
              onValueChange={([v]) => setWmOpacity(v)}
            />

            {/* Size */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">اندازه واترمارک</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['small', 'medium', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setWmSize(sz)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-bold border-2 transition-all',
                      wmSize === sz
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40 text-muted-foreground'
                    )}
                  >
                    {sz === 'small' ? 'کوچک' : sz === 'medium' ? 'متوسط' : 'بزرگ'}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ─── 3. File Naming ───────────────────────────────────── */}
          <SectionCard>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-7 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Tag className="size-3.5 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold">نام فایل خروجی</h3>
            </div>
            <input
              type="text"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              placeholder="مثال: product یا عکس-محصول"
              className={cn(
                'w-full rounded-xl border border-border bg-background',
                'px-3.5 py-2.5 text-sm outline-none',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                'transition-all placeholder:text-muted-foreground/50'
              )}
              dir="auto"
            />
            <p className="mt-2 text-xs text-muted-foreground/65 leading-relaxed">
              {baseName ? (
                <>
                  <span className="text-primary/70">مثال: </span>
                  {baseName}_001.jpg, {baseName}_002.jpg, …
                </>
              ) : (
                'اگر خالی باشد، نام اصلی فایل‌ها حفظ می‌شود'
              )}
            </p>
          </SectionCard>

          {/* ─── 4. Export ────────────────────────────────────────── */}
          <SectionCard>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Download className="size-3.5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold">خروجی</h3>
              {images.length > 0 && (
                <span className="ms-auto text-xs text-muted-foreground">
                  {images.length} تصویر
                </span>
              )}
            </div>

            {/* Not ready hint */}
            {!canProcess && (
              <div className="rounded-2xl bg-muted/60 p-4 mb-4 text-xs text-muted-foreground text-center leading-relaxed">
                {!images.length && !logoUrl && (
                  <>
                    <Info className="size-4 mx-auto mb-1.5 text-muted-foreground/50" />
                    ابتدا تصاویر و لوگوی واترمارک را بارگذاری کنید
                  </>
                )}
                {images.length > 0 && !logoUrl && (
                  <>
                    <ImageIcon className="size-4 mx-auto mb-1.5 text-amber-500" />
                    برای شروع، لوگوی واترمارک را بارگذاری کنید
                  </>
                )}
                {!images.length && logoUrl && (
                  <>
                    <Images className="size-4 mx-auto mb-1.5 text-amber-500" />
                    تصاویر خود را برای افزودن واترمارک بارگذاری کنید
                  </>
                )}
              </div>
            )}

            {/* Preview button */}
            {canProcess && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-xl h-9 mb-3 border border-border/60"
                disabled={isProcessing || isPreviewLoading}
                onClick={handlePreview}
              >
                {isPreviewLoading ? (
                  <><Loader2 className="size-3.5 animate-spin" /> بارگذاری پیش‌نمایش...</>
                ) : (
                  <>
                    <Eye className="size-3.5" />
                    پیش‌نمایش
                    <span className="text-muted-foreground text-xs">
                      ({Math.min(images.length, 3)} تصویر اول)
                    </span>
                  </>
                )}
              </Button>
            )}

            {/* Export buttons */}
            <div className="space-y-2.5">
              <Button
                variant="brand"
                size="lg"
                className="w-full rounded-2xl h-12 text-sm font-bold gap-2"
                disabled={!canProcess || isProcessing}
                onClick={() => runExport('zip')}
              >
                {isProcessing && exportStore.format === 'zip' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="tabular-nums">{processedCount}/{images.length}</span>
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <FileArchive className="size-4" />
                    دانلود ZIP
                    {images.length > 0 && (
                      <span className="opacity-70 font-normal text-xs">({images.length} تصویر)</span>
                    )}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl h-12 text-sm font-bold gap-2"
                disabled={!canProcess || isProcessing}
                onClick={() => runExport('pdf')}
              >
                {isProcessing && exportStore.format === 'pdf' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    در حال آماده‌سازی PDF...
                  </>
                ) : (
                  <>
                    <FileText className="size-4" />
                    دانلود PDF
                    {images.length > 0 && (
                      <span className="opacity-70 font-normal text-xs">({images.length} صفحه)</span>
                    )}
                  </>
                )}
              </Button>
            </div>

            {/* Quality slider */}
            <div className="mt-4 pt-4 border-t border-border/60">
              <Slider
                label="کیفیت خروجی"
                showValue
                formatValue={(v) => `${Math.round(v * 100)}٪`}
                min={0.5}
                max={1}
                step={0.02}
                value={[quality]}
                onValueChange={([v]) => setQuality(v)}
              />
            </div>

            {images.length > 0 && (
              <p className="mt-3 text-[11px] text-muted-foreground/65 text-center leading-relaxed">
                ابعاد اصلی تصاویر حفظ می‌شود · هر تصویر یک صفحه‌ PDF
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </>
  );
}
