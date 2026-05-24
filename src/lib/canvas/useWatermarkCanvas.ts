'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useWatermarkStore } from '@/store/useWatermarkStore';
import type {
  TextWatermarkConfig,
  ImageWatermarkConfig,
  QRWatermarkConfig,
  WatermarkPosition,
} from '@/types/watermark';
import { generateQRDataUrl } from '@/utils/qrGenerator';

export const WATERMARK_OBJ_NAME = 'watermark-obj';
export const TILE_OBJ_NAME = 'watermark-tile';

type FabricLib = typeof import('fabric')['fabric'];
type FabricCanvas = InstanceType<FabricLib['Canvas']>;

async function getFabric(): Promise<FabricLib> {
  const mod = await import('fabric');
  return mod.fabric;
}

export interface WatermarkCanvasAPI {
  /** Attach to a <div> — pass as ref callback */
  mountRef: (node: HTMLDivElement | null) => void;
  isReady: boolean;
  applyWatermark: () => Promise<void>;
  removeWatermark: () => void;
  snapToPosition: (pos: WatermarkPosition) => void;
  loadFromJson: (json: string) => void;
  getCanvasJson: () => string;
  getExportDataUrl: (quality?: number) => string | null;
  processAllImages: () => Promise<Array<{ id: string; dataUrl: string; name: string }>>;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export function useWatermarkCanvas(): WatermarkCanvasAPI {
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  const store = useWatermarkStore();
  const { mode, textConfig, imageConfig, qrConfig, position, tileSpacing } = store;

  const [debouncedText] = useDebounce(textConfig, 100);
  const [debouncedImage] = useDebounce(imageConfig, 100);
  const [debouncedQR] = useDebounce(qrConfig, 150);

  /* ── Init ────────────────────────────────────────────── */
  const initCanvas = useCallback(async (container: HTMLDivElement) => {
    if (fabricRef.current) return;

    const el = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(el);

    const fabric = await getFabric();
    await document.fonts.ready;

    const canvas = new fabric.Canvas(el, {
      selection: true,
      preserveObjectStacking: true,
      stopContextMenu: true,
      enableRetinaScaling: true,
    });

    canvas.setWidth(container.offsetWidth || 700);
    canvas.setHeight(container.offsetHeight || 500);

    canvas.on('object:modified', () => {
      const json = JSON.stringify(canvas.toJSON(['name']));
      store.pushHistory(json);
    });

    fabricRef.current = canvas;
    setIsReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mountRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (node) initCanvas(node);
    },
    [initCanvas]
  );

  /* ── Resize on window change ─────────────────────────── */
  useEffect(() => {
    const handleResize = () => {
      const canvas = fabricRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.setWidth(container.offsetWidth);
      canvas.setHeight(container.offsetHeight);
      canvas.renderAll();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── Load background image ───────────────────────────── */
  const loadBackground = useCallback(async (imageUrl: string) => {
    const canvas = fabricRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const fabric = await getFabric();
    const cw = container.offsetWidth || 700;
    const ch = container.offsetHeight || 500;
    canvas.setWidth(cw);
    canvas.setHeight(ch);

    await new Promise<void>((resolve) => {
      fabric.Image.fromURL(
        imageUrl,
        (img: any) => {
          if (!img.width || !img.height) { resolve(); return; }
          const scale = Math.min(cw / img.width, ch / img.height, 1);
          const offsetX = (cw - img.width * scale) / 2;
          const offsetY = (ch - img.height * scale) / 2;

          canvas.setBackgroundImage(img, () => {
            canvas.renderAll();
            resolve();
          }, {
            scaleX: scale,
            scaleY: scale,
            left: offsetX,
            top: offsetY,
          });
        },
        { crossOrigin: 'anonymous' }
      );
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const img = store.images.find((i) => i.id === store.activeImageId);
    if (img) loadBackground(img.url);
  }, [store.activeImageId, isReady, loadBackground]); // eslint-disable-line

  /* ── Remove watermark ────────────────────────────────── */
  const removeWatermark = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const toRemove = canvas.getObjects().filter(
      (o: any) => o.name === WATERMARK_OBJ_NAME || o.name === TILE_OBJ_NAME
    );
    toRemove.forEach((o: any) => canvas.remove(o));
    canvas.renderAll();
  }, []);

  /* ── Snap to position ────────────────────────────────── */
  const snapToPosition = useCallback((pos: WatermarkPosition) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getObjects().find((o: any) => o.name === WATERMARK_OBJ_NAME) as any;
    if (!obj || pos === 'tile') return;

    const cw = canvas.getWidth();
    const ch = canvas.getHeight();
    const pad = 24;
    const ow = obj.getScaledWidth?.() ?? 100;
    const oh = obj.getScaledHeight?.() ?? 40;

    const map: Record<string, { left: number; top: number }> = {
      'top-left':      { left: pad + ow / 2,         top: pad + oh / 2 },
      'top-center':    { left: cw / 2,                top: pad + oh / 2 },
      'top-right':     { left: cw - pad - ow / 2,     top: pad + oh / 2 },
      'middle-left':   { left: pad + ow / 2,          top: ch / 2 },
      'center':        { left: cw / 2,                top: ch / 2 },
      'middle-right':  { left: cw - pad - ow / 2,     top: ch / 2 },
      'bottom-left':   { left: pad + ow / 2,          top: ch - pad - oh / 2 },
      'bottom-center': { left: cw / 2,                top: ch - pad - oh / 2 },
      'bottom-right':  { left: cw - pad - ow / 2,     top: ch - pad - oh / 2 },
    };

    if (map[pos]) {
      obj.set({ ...map[pos], originX: 'center', originY: 'center' });
      canvas.renderAll();
    }
  }, []);

  /* ── Tile pattern builder ────────────────────────────── */
  const buildTilePattern = useCallback(
    async (cfg: TextWatermarkConfig, spacing: number) => {
      const fabric = await getFabric();
      const fontSize = cfg.fontSize;
      const tileW = Math.max(cfg.text.length * fontSize * 0.65 + spacing, 160);
      const tileH = fontSize * 1.6 + spacing;

      const tc = document.createElement('canvas');
      tc.width = tileW;
      tc.height = tileH;
      const ctx = tc.getContext('2d')!;
      ctx.clearRect(0, 0, tileW, tileH);

      const weight = cfg.bold ? 'bold' : 'normal';
      const style = cfg.italic ? 'italic' : 'normal';
      ctx.font = `${style} ${weight} ${fontSize}px "${cfg.fontFamily}"`;
      ctx.fillStyle = cfg.color;
      ctx.globalAlpha = cfg.opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (cfg.shadowEnabled) {
        ctx.shadowColor = cfg.shadowColor;
        ctx.shadowBlur = cfg.shadowBlur;
        ctx.shadowOffsetX = cfg.shadowOffsetX;
        ctx.shadowOffsetY = cfg.shadowOffsetY;
      }

      ctx.save();
      ctx.translate(tileW / 2, tileH / 2);
      ctx.rotate((cfg.rotation * Math.PI) / 180);
      ctx.fillText(cfg.text, 0, 0);
      ctx.restore();

      return new (fabric.Pattern as any)({ source: tc, repeat: 'repeat' });
    },
    []
  );

  /* ── Apply text watermark ────────────────────────────── */
  const applyTextWatermark = useCallback(
    async (cfg: TextWatermarkConfig, pos: WatermarkPosition, spacing: number) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const fabric = await getFabric();

      removeWatermark();
      if (!cfg.text.trim()) { canvas.renderAll(); return; }

      if (pos === 'tile') {
        const pattern = await buildTilePattern(cfg, spacing);
        const rect = new fabric.Rect({
          width: canvas.getWidth(),
          height: canvas.getHeight(),
          fill: pattern as any,
          selectable: false,
          evented: false,
          left: 0,
          top: 0,
        } as any);
        (rect as any).name = TILE_OBJ_NAME;
        canvas.add(rect);
        canvas.renderAll();
        store.pushHistory(JSON.stringify(canvas.toJSON(['name'])));
        return;
      }

      const shadow = cfg.shadowEnabled
        ? new fabric.Shadow({
            color: cfg.shadowColor,
            blur: cfg.shadowBlur,
            offsetX: cfg.shadowOffsetX,
            offsetY: cfg.shadowOffsetY,
          })
        : null;

      const text = new fabric.Text(cfg.text, {
        fontFamily: cfg.fontFamily,
        fontSize: cfg.fontSize,
        fontWeight: cfg.bold ? 'bold' : 'normal',
        fontStyle: cfg.italic ? 'italic' : 'normal',
        fill: cfg.color,
        opacity: cfg.opacity,
        angle: cfg.rotation,
        charSpacing: cfg.letterSpacing * 10,
        originX: 'center',
        originY: 'center',
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        selectable: true,
        hasControls: true,
        shadow: shadow ?? undefined,
        stroke: cfg.strokeEnabled ? cfg.strokeColor : undefined,
        strokeWidth: cfg.strokeEnabled ? cfg.strokeWidth : 0,
      } as any);
      (text as any).name = WATERMARK_OBJ_NAME;

      canvas.add(text);
      canvas.setActiveObject(text);
      snapToPosition(pos);
      canvas.renderAll();
      store.pushHistory(JSON.stringify(canvas.toJSON(['name'])));
    },
    [removeWatermark, buildTilePattern, snapToPosition] // eslint-disable-line
  );

  /* ── Apply image watermark ───────────────────────────── */
  const applyImageWatermark = useCallback(
    async (cfg: ImageWatermarkConfig, pos: WatermarkPosition) => {
      const canvas = fabricRef.current;
      if (!canvas || !cfg.url) return;
      const fabric = await getFabric();

      removeWatermark();

      await new Promise<void>((resolve) => {
        fabric.Image.fromURL(
          cfg.url,
          (img: any) => {
            const maxPx = Math.min(canvas.getWidth(), canvas.getHeight()) * cfg.scale;
            const imgScale = maxPx / Math.max(img.width ?? 1, img.height ?? 1);
            img.set({
              scaleX: imgScale,
              scaleY: imgScale,
              opacity: cfg.opacity,
              angle: cfg.rotation,
              originX: 'center',
              originY: 'center',
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              selectable: true,
              hasControls: true,
            } as any);
            (img as any).name = WATERMARK_OBJ_NAME;

            canvas.add(img);
            canvas.setActiveObject(img);
            snapToPosition(pos);
            canvas.renderAll();
            store.pushHistory(JSON.stringify(canvas.toJSON(['name'])));
            resolve();
          },
          { crossOrigin: 'anonymous' }
        );
      });
    },
    [removeWatermark, snapToPosition] // eslint-disable-line
  );

  /* ── Apply QR watermark ──────────────────────────────── */
  const applyQRWatermark = useCallback(
    async (cfg: QRWatermarkConfig, pos: WatermarkPosition) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const fabric = await getFabric();

      removeWatermark();
      try {
        const dataUrl = await generateQRDataUrl(cfg);
        await new Promise<void>((resolve) => {
          fabric.Image.fromURL(dataUrl, (img: any) => {
            const scale = cfg.size / Math.max(img.width ?? 1, img.height ?? 1);
            img.set({
              scaleX: scale,
              scaleY: scale,
              opacity: cfg.opacity,
              originX: 'center',
              originY: 'center',
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              selectable: true,
              hasControls: true,
            } as any);
            (img as any).name = WATERMARK_OBJ_NAME;

            canvas.add(img);
            canvas.setActiveObject(img);
            snapToPosition(pos);
            canvas.renderAll();
            store.pushHistory(JSON.stringify(canvas.toJSON(['name'])));
            resolve();
          });
        });
      } catch (e) {
        console.error('QR failed', e);
      }
    },
    [removeWatermark, snapToPosition] // eslint-disable-line
  );

  /* ── Master apply ────────────────────────────────────── */
  const applyWatermark = useCallback(async () => {
    switch (mode) {
      case 'text':  return applyTextWatermark(textConfig, position, tileSpacing);
      case 'image': return applyImageWatermark(imageConfig, position);
      case 'qr':    return applyQRWatermark(qrConfig, position);
    }
  }, [mode, textConfig, imageConfig, qrConfig, position, tileSpacing,
      applyTextWatermark, applyImageWatermark, applyQRWatermark]);

  /* ── Auto-apply on debounced changes ─────────────────── */
  useEffect(() => {
    if (!isReady || mode !== 'text') return;
    applyTextWatermark(debouncedText, position, tileSpacing);
  }, [debouncedText, position, tileSpacing, isReady]); // eslint-disable-line

  useEffect(() => {
    if (!isReady || mode !== 'image') return;
    applyImageWatermark(debouncedImage, position);
  }, [debouncedImage, position, isReady]); // eslint-disable-line

  useEffect(() => {
    if (!isReady || mode !== 'qr') return;
    applyQRWatermark(debouncedQR, position);
  }, [debouncedQR, position, isReady]); // eslint-disable-line

  /* ── Also re-apply when mode changes ────────────────── */
  useEffect(() => {
    if (!isReady) return;
    applyWatermark();
  }, [mode, isReady]); // eslint-disable-line

  /* ── Load from JSON (undo/redo) ─────────────────────── */
  const loadFromJson = useCallback((json: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      canvas.loadFromJSON(JSON.parse(json), () => canvas.renderAll());
    } catch {}
  }, []);

  const getCanvasJson = useCallback(
    () => JSON.stringify(fabricRef.current?.toJSON(['name']) ?? {}),
    []
  );

  /* ── Export ─────────────────────────────────────────── */
  const getExportDataUrl = useCallback((quality = 0.92): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    // Deselect before export so handles don't show
    canvas.discardActiveObject();
    canvas.renderAll();
    return canvas.toDataURL({ format: 'jpeg', quality, multiplier: 2 });
  }, []);

  /* ── Batch process ───────────────────────────────────── */
  const processAllImages = useCallback(async () => {
    const results: Array<{ id: string; dataUrl: string; name: string }> = [];
    const { images } = store;
    for (const img of images) {
      store.setActiveImage(img.id);
      await loadBackground(img.url);
      await new Promise((r) => setTimeout(r, 250));
      await applyWatermark();
      await new Promise((r) => setTimeout(r, 150));
      const dataUrl = getExportDataUrl();
      if (dataUrl) results.push({ id: img.id, dataUrl, name: img.name });
    }
    return results;
  }, [loadBackground, applyWatermark, getExportDataUrl]); // eslint-disable-line

  /* ── Zoom ────────────────────────────────────────────── */
  const zoomIn  = useCallback(() => { const c = fabricRef.current; if (c) { c.setZoom(c.getZoom() * 1.2); c.renderAll(); } }, []);
  const zoomOut = useCallback(() => { const c = fabricRef.current; if (c) { c.setZoom(c.getZoom() / 1.2); c.renderAll(); } }, []);
  const resetZoom = useCallback(() => { const c = fabricRef.current; if (c) { c.setZoom(1); c.renderAll(); } }, []);

  /* ── Cleanup ─────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, []);

  return {
    mountRef,
    isReady,
    applyWatermark,
    removeWatermark,
    snapToPosition,
    loadFromJson,
    getCanvasJson,
    getExportDataUrl,
    processAllImages,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
