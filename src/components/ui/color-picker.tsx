// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

const PRESETS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-xs font-medium text-foreground">{label}</p>}
      <div className="flex items-center gap-2">
        {/* Native color input */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="size-8 rounded-lg border-2 border-border shadow-sm shrink-0 transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: value }}
          aria-label="انتخاب رنگ"
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="flex-1 h-8 rounded-lg border border-input bg-background px-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          dir="ltr"
          maxLength={7}
          placeholder="#ffffff"
        />
      </div>

      {/* Color presets */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn(
              'size-5 rounded-md border transition-all hover:scale-110 active:scale-95',
              value === c ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border'
            )}
            style={{ backgroundColor: c }}
            aria-label={c}
          />
        ))}
      </div>
    </div>
  );
}
