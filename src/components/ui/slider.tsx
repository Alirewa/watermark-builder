// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showValue?: boolean;
  valueSuffix?: string;
  formatValue?: (v: number) => string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, showValue, valueSuffix = '', formatValue, ...props }, ref) => {
  const value = Array.isArray(props.value) ? props.value[0] : props.defaultValue?.[0] ?? 0;
  const display = formatValue ? formatValue(value) : `${value}${valueSuffix}`;

  return (
    <div className="w-full space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-foreground">{label}</span>}
          {showValue && <span className="text-xs text-muted-foreground tabular-nums">{display}</span>}
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            'block size-4 rounded-full border-2 border-primary bg-background shadow',
            'ring-offset-background transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            'cursor-grab active:cursor-grabbing'
          )}
        />
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
