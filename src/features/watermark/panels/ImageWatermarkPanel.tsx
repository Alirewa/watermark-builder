'use client';

import { useRef } from 'react';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { isValidImageType } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

export function ImageWatermarkPanel() {
  const { imageConfig, setImageConfig, setLogoUrl } = useWatermarkStore();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File) => {
    if (!isValidImageType(file.type) && file.type !== 'image/svg+xml') {
      toast.error('فرمت نامعتبر', 'فقط PNG، JPG یا SVG مجاز است');
      return;
    }
    // Revoke previous URL
    if (imageConfig.url) URL.revokeObjectURL(imageConfig.url);
    setLogoUrl(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-4">
      {/* Logo upload */}
      <div className="space-y-2">
        <p className="text-xs font-medium">تصویر لوگو (PNG / SVG)</p>

        {imageConfig.url ? (
          <div className="relative rounded-xl border border-border overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageConfig.url}
              alt="Logo"
              className="w-full h-32 object-contain bg-[url('/placeholder-bg.svg')]"
            />
            <button
              onClick={() => setLogoUrl('')}
              className="absolute top-2 end-2 size-7 rounded-lg bg-destructive/90 text-white flex items-center justify-center hover:bg-destructive transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/3 transition-all p-6 flex flex-col items-center gap-2 text-muted-foreground"
          >
            <Upload className="size-6" />
            <span className="text-xs">کلیک کنید یا بکشید و رها کنید</span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleLogoFile(e.target.files[0])}
        />
      </div>

      {imageConfig.url && (
        <>
          <Slider
            label="اندازه"
            showValue
            formatValue={(v) => `${Math.round(v * 100)}٪`}
            min={0.05} max={0.9} step={0.05}
            value={[imageConfig.scale]}
            onValueChange={([v]) => setImageConfig({ scale: v })}
          />
          <Slider
            label="شفافیت"
            showValue
            formatValue={(v) => `${Math.round(v * 100)}٪`}
            min={0.05} max={1} step={0.05}
            value={[imageConfig.opacity]}
            onValueChange={([v]) => setImageConfig({ opacity: v })}
          />
          <Slider
            label="چرخش"
            showValue valueSuffix="°"
            min={-180} max={180} step={1}
            value={[imageConfig.rotation]}
            onValueChange={([v]) => setImageConfig({ rotation: v })}
          />

          <GlassCard className="p-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <ImageIcon className="size-3.5 mt-0.5 shrink-0 text-primary" />
              <p>برای تغییر موقعیت، تصویر را روی بوم بکشید. برای تغییر اندازه از دستگیره‌های گوشه استفاده کنید.</p>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
