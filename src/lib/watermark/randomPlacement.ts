// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import type { WatermarkOptions } from '@/types/watermark';
import { PLACEMENT_TEMPLATES } from '@/types/watermark';

/* ─── Helpers ────────────────────────────────────────────────── */
function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Cannot load: ${url}`));
    img.src = url;
  });
}

/* ─── Core: apply template watermarks to ONE image ──────────── */
/**
 * Loads `sourceUrl` at its original resolution and stamps `watermarkUrl`
 * at the 3 fixed positions defined by the chosen placement template.
 * Original image dimensions are NEVER changed.
 */
export async function applyTemplateWatermarks(
  sourceUrl: string,
  watermarkUrl: string,
  options: WatermarkOptions,
  quality = 0.92
): Promise<string> {
  const template =
    PLACEMENT_TEMPLATES.find((t) => t.id === options.templateId) ??
    PLACEMENT_TEMPLATES[0];

  const [src, mark] = await Promise.all([
    loadImg(sourceUrl),
    loadImg(watermarkUrl),
  ]);

  const W = src.naturalWidth || 800;
  const H = src.naturalHeight || 600;
  const minDim = Math.min(W, H);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Draw source image at original size
  ctx.drawImage(src, 0, 0, W, H);

  // Watermark dimensions
  const mw = Math.round(minDim * options.sizeRatio);
  const aspect = mark.naturalHeight / Math.max(mark.naturalWidth, 1);
  const mh = Math.round(mw * aspect);

  // Draw at each template position
  for (const pos of template.positions) {
    const cx = W * pos.x;
    const cy = H * pos.y;
    ctx.save();
    ctx.globalAlpha = options.opacity;
    ctx.drawImage(mark, cx - mw / 2, cy - mh / 2, mw, mh);
    ctx.restore();
  }

  return canvas.toDataURL('image/jpeg', quality);
}

/* ─── Batch ─────────────────────────────────────────────────── */
export interface BatchItem {
  id: string;
  name: string;
  url: string;
}

export interface BatchResult {
  id: string;
  name: string;
  dataUrl: string;
}

/**
 * Sequentially processes every image to keep memory usage manageable
 * even with 70+ large files. Calls `onProgress` after each image.
 */
export async function batchApplyWatermarks(
  images: BatchItem[],
  watermarkUrl: string,
  options: WatermarkOptions,
  quality: number,
  onProgress: (current: number, total: number) => void
): Promise<BatchResult[]> {
  const results: BatchResult[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    onProgress(i, images.length);

    const dataUrl = await applyTemplateWatermarks(
      img.url,
      watermarkUrl,
      options,
      quality
    );
    results.push({ id: img.id, name: img.name, dataUrl });

    // Yield to the event loop so the UI stays responsive
    await new Promise<void>((r) => setTimeout(r, 0));
  }

  onProgress(images.length, images.length);
  return results;
}
