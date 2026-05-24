'use client';

import { useWatermarkStore } from '@/store/useWatermarkStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { WatermarkPosition } from '@/types/watermark';
import { LayoutGrid } from 'lucide-react';

const GRID_POSITIONS: { pos: WatermarkPosition; label: string }[] = [
  { pos: 'top-right',     label: 'بالا راست' },
  { pos: 'top-center',    label: 'بالا وسط' },
  { pos: 'top-left',      label: 'بالا چپ' },
  { pos: 'middle-right',  label: 'وسط راست' },
  { pos: 'center',        label: 'مرکز' },
  { pos: 'middle-left',   label: 'وسط چپ' },
  { pos: 'bottom-right',  label: 'پایین راست' },
  { pos: 'bottom-center', label: 'پایین وسط' },
  { pos: 'bottom-left',   label: 'پایین چپ' },
];

export function PositionPanel() {
  const { position, setPosition, tileSpacing, setTileSpacing } = useWatermarkStore();

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">موقعیت</p>

      {/* 3×3 grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {GRID_POSITIONS.map(({ pos, label }) => (
          <button
            key={pos}
            onClick={() => setPosition(pos)}
            title={label}
            className={cn(
              'aspect-square rounded-xl border-2 transition-all flex items-center justify-center',
              'hover:border-primary/50 hover:bg-primary/5',
              position === pos
                ? 'border-primary bg-primary/10 shadow-glow-sm'
                : 'border-border bg-muted/30'
            )}
          >
            <div
              className={cn(
                'size-2 rounded-full',
                position === pos ? 'bg-primary' : 'bg-muted-foreground/40'
              )}
            />
          </button>
        ))}
      </div>

      {/* Tile mode */}
      <button
        onClick={() => setPosition('tile')}
        className={cn(
          'w-full flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 transition-all text-sm font-medium',
          position === 'tile'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:border-primary/50 hover:bg-primary/5 text-foreground'
        )}
      >
        <LayoutGrid className="size-4 shrink-0" />
        <span>حالت تکراری (Tile)</span>
        {position === 'tile' && (
          <span className="ms-auto text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
            فعال
          </span>
        )}
      </button>

      {position === 'tile' && (
        <Slider
          label="فاصله بین تکرارها"
          showValue valueSuffix="px"
          min={10} max={200} step={5}
          value={[tileSpacing]}
          onValueChange={([v]) => setTileSpacing(v)}
        />
      )}
    </div>
  );
}
