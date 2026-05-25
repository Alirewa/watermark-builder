// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useEffect, useState } from 'react';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { generateQRDataUrl } from '@/utils/qrGenerator';

export function QRWatermarkPanel() {
  const { qrConfig, setQRConfig } = useWatermarkStore();
  const [preview, setPreview] = useState<string>('');
  const [transparent, setTransparent] = useState(qrConfig.background === 'transparent');

  useEffect(() => {
    let cancelled = false;
    generateQRDataUrl(qrConfig).then((url) => {
      if (!cancelled) setPreview(url);
    });
    return () => { cancelled = true; };
  }, [qrConfig]);

  return (
    <div className="space-y-4">
      {/* QR preview */}
      {preview && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="QR Preview"
            className="size-28 rounded-xl border border-border bg-white p-1"
          />
        </div>
      )}

      <Input
        label="محتوای QR"
        placeholder="آدرس، متن یا هر داده‌ای..."
        value={qrConfig.content}
        onChange={(e) => setQRConfig({ content: e.target.value })}
        dir="ltr"
      />

      <Slider
        label="اندازه QR"
        showValue valueSuffix="px"
        min={60} max={300} step={10}
        value={[qrConfig.size]}
        onValueChange={([v]) => setQRConfig({ size: v })}
      />
      <Slider
        label="شفافیت"
        showValue
        formatValue={(v) => `${Math.round(v * 100)}٪`}
        min={0.1} max={1} step={0.05}
        value={[qrConfig.opacity]}
        onValueChange={([v]) => setQRConfig({ opacity: v })}
      />
      <Slider
        label="حاشیه"
        showValue
        min={0} max={5} step={1}
        value={[qrConfig.margin]}
        onValueChange={([v]) => setQRConfig({ margin: v })}
      />

      <ColorPicker
        label="رنگ QR"
        value={qrConfig.foreground}
        onChange={(foreground) => setQRConfig({ foreground })}
      />

      <div className="flex items-center justify-between py-1">
        <Label className="text-xs font-medium">پس‌زمینه شفاف</Label>
        <Switch
          checked={transparent}
          onCheckedChange={(v) => {
            setTransparent(v);
            setQRConfig({ background: v ? 'transparent' : '#ffffff' });
          }}
        />
      </div>

      {!transparent && (
        <ColorPicker
          label="رنگ پس‌زمینه"
          value={qrConfig.background === 'transparent' ? '#ffffff' : qrConfig.background}
          onChange={(background) => setQRConfig({ background })}
        />
      )}
    </div>
  );
}
