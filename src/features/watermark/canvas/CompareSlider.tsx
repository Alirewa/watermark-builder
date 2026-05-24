'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompareSliderProps {
  originalUrl: string;
  watermarkedDataUrl: string;
  className?: string;
}

export function CompareSlider({ originalUrl, watermarkedDataUrl, className }: CompareSliderProps) {
  const [position, setPosition] = useState(50); // percent
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const onUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl select-none cursor-ew-resize',
        className
      )}
      style={{ userSelect: 'none' }}
    >
      {/* Original (bottom layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={originalUrl}
        alt="اصلی"
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* Watermarked (clipped top layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={watermarkedDataUrl}
          alt="واترمارک"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 start-3 text-[10px] font-bold bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border text-muted-foreground pointer-events-none">
        اصلی
      </div>
      <div className="absolute bottom-3 end-3 text-[10px] font-bold bg-primary/90 text-primary-foreground px-2 py-1 rounded-lg pointer-events-none">
        واترمارک
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(0,0,0,0.4)] z-10"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 z-20 -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${position}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="size-8 rounded-full bg-white shadow-float flex items-center justify-center cursor-ew-resize"
        >
          <GripVertical className="size-4 text-gray-600" />
        </motion.div>
      </div>
    </div>
  );
}
