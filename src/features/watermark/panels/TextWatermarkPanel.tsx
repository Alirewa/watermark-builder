'use client';

import { useWatermarkStore } from '@/store/useWatermarkStore';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FONT_FAMILIES } from '@/types/watermark';
import { Bold, Italic, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TextWatermarkPanel() {
  const { textConfig: c, setTextConfig, resetTextConfig } = useWatermarkStore();

  return (
    <div className="space-y-4">
      {/* Text input */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">متن واترمارک</Label>
        <textarea
          value={c.text}
          onChange={(e) => setTextConfig({ text: e.target.value })}
          rows={2}
          placeholder="متن واترمارک خود را وارد کنید..."
          className={cn(
            'w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
          )}
        />
      </div>

      {/* Font family */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">فونت</Label>
        <Select value={c.fontFamily} onValueChange={(v) => setTextConfig({ fontFamily: v })}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-xs">
                <span style={{ fontFamily: f.value }}>{f.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bold / Italic */}
      <div className="flex gap-2">
        <Button
          variant={c.bold ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => setTextConfig({ bold: !c.bold })}
        >
          <Bold className="size-3.5" />
          پررنگ
        </Button>
        <Button
          variant={c.italic ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => setTextConfig({ italic: !c.italic })}
        >
          <Italic className="size-3.5" />
          ایتالیک
        </Button>
      </div>

      {/* Sliders */}
      <Slider
        label="اندازه فونت"
        showValue valueSuffix="px"
        min={12} max={200} step={2}
        value={[c.fontSize]}
        onValueChange={([v]) => setTextConfig({ fontSize: v })}
      />
      <Slider
        label="شفافیت"
        showValue
        formatValue={(v) => `${Math.round(v * 100)}٪`}
        min={0.05} max={1} step={0.05}
        value={[c.opacity]}
        onValueChange={([v]) => setTextConfig({ opacity: v })}
      />
      <Slider
        label="چرخش"
        showValue valueSuffix="°"
        min={-180} max={180} step={1}
        value={[c.rotation]}
        onValueChange={([v]) => setTextConfig({ rotation: v })}
      />
      <Slider
        label="فاصله حروف"
        showValue
        min={0} max={30} step={1}
        value={[c.letterSpacing]}
        onValueChange={([v]) => setTextConfig({ letterSpacing: v })}
      />

      {/* Color */}
      <ColorPicker
        label="رنگ متن"
        value={c.color}
        onChange={(color) => setTextConfig({ color })}
      />

      {/* Shadow */}
      <div className="rounded-xl border border-border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">سایه</Label>
          <Switch
            checked={c.shadowEnabled}
            onCheckedChange={(v) => setTextConfig({ shadowEnabled: v })}
          />
        </div>
        {c.shadowEnabled && (
          <div className="space-y-3">
            <ColorPicker
              label="رنگ سایه"
              value={c.shadowColor}
              onChange={(shadowColor) => setTextConfig({ shadowColor })}
            />
            <Slider
              label="بلور سایه"
              showValue
              min={0} max={30} step={1}
              value={[c.shadowBlur]}
              onValueChange={([v]) => setTextConfig({ shadowBlur: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Slider
                label="افست X"
                showValue
                min={-20} max={20} step={1}
                value={[c.shadowOffsetX]}
                onValueChange={([v]) => setTextConfig({ shadowOffsetX: v })}
              />
              <Slider
                label="افست Y"
                showValue
                min={-20} max={20} step={1}
                value={[c.shadowOffsetY]}
                onValueChange={([v]) => setTextConfig({ shadowOffsetY: v })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stroke */}
      <div className="rounded-xl border border-border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">حاشیه (Stroke)</Label>
          <Switch
            checked={c.strokeEnabled}
            onCheckedChange={(v) => setTextConfig({ strokeEnabled: v })}
          />
        </div>
        {c.strokeEnabled && (
          <div className="space-y-3">
            <ColorPicker
              label="رنگ حاشیه"
              value={c.strokeColor}
              onChange={(strokeColor) => setTextConfig({ strokeColor })}
            />
            <Slider
              label="ضخامت حاشیه"
              showValue
              min={1} max={10} step={0.5}
              value={[c.strokeWidth]}
              onValueChange={([v]) => setTextConfig({ strokeWidth: v })}
            />
          </div>
        )}
      </div>

      {/* Reset */}
      <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={resetTextConfig}>
        <RotateCcw className="size-3.5" />
        بازنشانی پیش‌فرض
      </Button>
    </div>
  );
}
