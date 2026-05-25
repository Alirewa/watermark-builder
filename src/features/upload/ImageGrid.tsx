// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Images, Eraser } from 'lucide-react';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn, formatBytes, isValidImageType } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { stripMetadata } from '@/utils/metadataCleaner';

export function ImageGrid() {
  const { images, activeImageId, addImages, removeImage, setActiveImage } =
    useWatermarkStore();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stripMeta, setStripMeta] = useState(false);
  const [processing, setProcessing] = useState(false);

  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter(
        (f) => isValidImageType(f.type)
      );

      if (valid.length === 0) {
        toast.error('فرمت نامعتبر', 'فقط تصاویر JPEG/PNG/WebP/GIF مجاز است');
        return;
      }

      if (stripMeta) {
        setProcessing(true);
        try {
          const cleaned = await Promise.all(
            valid.map(async (file) => {
              const { blob } = await stripMetadata(file);
              return new File([blob], file.name, { type: blob.type });
            })
          );
          addImages(cleaned);
          toast.success(`${cleaned.length} تصویر اضافه شد`, 'متادیتا پاک شد');
        } catch {
          toast.error('خطا در پاکسازی متادیتا');
          addImages(valid);
        } finally {
          setProcessing(false);
        }
      } else {
        addImages(valid);
        if (valid.length > 0)
          toast.success(`${valid.length} تصویر اضافه شد`);
      }
    },
    [addImages, stripMeta, toast]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Images className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold">تصاویر</span>
          {images.length > 0 && (
            <Badge variant="default" className="text-[10px] h-4 px-1.5 py-0">
              {images.length}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => fileRef.current?.click()}
          disabled={processing}
          className="rounded-lg"
        >
          <Upload className="size-3.5" />
        </Button>
      </div>

      {/* Drop zone */}
      <motion.button
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        disabled={processing}
        className={cn(
          'w-full rounded-xl border-2 border-dashed py-5 flex flex-col items-center gap-2',
          'transition-all duration-200 text-muted-foreground shrink-0',
          isDragging
            ? 'border-primary bg-primary/8 text-primary scale-[1.01]'
            : 'border-border hover:border-primary/40 hover:bg-primary/3',
          processing && 'opacity-50 cursor-wait'
        )}
      >
        {processing ? (
          <span className="text-xs animate-pulse">در حال پردازش...</span>
        ) : (
          <>
            <Upload className="size-5" />
            <span className="text-xs font-medium">
              {isDragging ? 'رها کنید!' : 'بکشید یا کلیک کنید'}
            </span>
          </>
        )}
      </motion.button>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />

      {/* Strip metadata toggle */}
      <div className="flex items-center justify-between py-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <Eraser className="size-3.5 text-muted-foreground" />
          <Label className="text-xs text-muted-foreground cursor-pointer">
            پاک‌سازی متادیتا
          </Label>
        </div>
        <Switch
          checked={stripMeta}
          onCheckedChange={setStripMeta}
          id="strip-meta"
        />
      </div>

      {/* Image list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
        <AnimatePresence initial={false}>
          {images.map((img, idx) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}
            >
              <button
                onClick={() => setActiveImage(img.id)}
                className={cn(
                  'group w-full flex items-center gap-2.5 rounded-xl border-2 p-2 transition-all text-start',
                  activeImageId === img.id
                    ? 'border-primary bg-primary/8'
                    : 'border-border hover:border-primary/30 hover:bg-accent'
                )}
              >
                {/* Thumbnail */}
                <div className="size-10 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {activeImageId === img.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="size-4 text-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{img.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatBytes(img.size)}
                  </p>
                </div>

                {/* Index badge */}
                <span className="text-[10px] text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  #{idx + 1}
                </span>

                {/* Remove */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Images className="size-8 opacity-25" />
            <p className="text-xs text-center opacity-60">هنوز تصویری اضافه نشده</p>
          </div>
        )}
      </div>
    </div>
  );
}
