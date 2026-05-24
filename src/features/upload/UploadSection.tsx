'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ImageIcon, X, FileImage, CheckCircle2 } from 'lucide-react';
import { cn, formatBytes, generateId, isValidImageType } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';

export function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addUpload, uploads } = useAppStore();
  const { toast } = useToast();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        if (!isValidImageType(file.type)) {
          toast.error('فرمت نامعتبر', `${file.name} پشتیبانی نمی‌شود`);
          return;
        }
        const url = URL.createObjectURL(file);
        addUpload({
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          preview: url,
          status: 'pending',
        });
      });
    },
    [addUpload, toast]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative rounded-3xl border-2 border-dashed cursor-pointer',
          'flex flex-col items-center justify-center p-10 gap-4',
          'transition-all duration-300 group',
          isDragging
            ? 'border-primary bg-primary/8 shadow-glow'
            : 'border-border hover:border-primary/50 hover:bg-primary/3'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <motion.div
          animate={isDragging ? { y: -6 } : { y: 0 }}
          className={cn(
            'size-16 rounded-2xl flex items-center justify-center',
            'transition-all duration-300',
            isDragging
              ? 'bg-primary/20 text-primary'
              : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
          )}
        >
          <Upload className="size-7" />
        </motion.div>

        <div className="text-center">
          <p className="font-semibold text-base">
            {isDragging ? 'رها کنید!' : 'تصاویر را اینجا بکشید و رها کنید'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            یا کلیک کنید برای انتخاب فایل
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            JPG، PNG، WebP، GIF تا ۲۰ مگابایت
          </p>
        </div>

        <Button variant="outline" size="sm" className="pointer-events-none">
          <ImageIcon className="size-3.5" />
          انتخاب تصویر
        </Button>
      </motion.div>

      {/* File list */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploads.map((file, i) => (
              <UploadedFileRow key={file.id} file={file} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadedFileRow({
  file,
  index,
}: {
  file: ReturnType<typeof useAppStore.getState>['uploads'][number];
  index: number;
}) {
  const { removeUpload } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <div className="size-10 rounded-xl overflow-hidden bg-muted shrink-0">
          {file.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
          ) : (
            <FileImage className="size-5 m-auto mt-2.5 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>

        {/* Status */}
        <div className="shrink-0">
          {file.status === 'done' && <CheckCircle2 className="size-4 text-emerald-500" />}
          {file.status === 'pending' && (
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
              آماده
            </span>
          )}
        </div>

        {/* Remove */}
        <button
          onClick={() => removeUpload(file.id)}
          className="shrink-0 size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </GlassCard>
    </motion.div>
  );
}
