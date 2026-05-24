'use client';

export interface PdfExportItem {
  name: string;
  dataUrl: string;
}

export interface PdfExportOptions {
  /** JPEG re-compression quality 0–1 before embedding (default 0.92) */
  quality?: number;
  /** PDF document title & download filename (default 'واترمارک‌ها') */
  title?: string;
  onProgress?: (pct: number, label: string) => void;
}

/** Fetch image pixel dimensions from a data-URL. */
function getImageDimensions(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 800, h: 600 });
    img.src = dataUrl;
  });
}

/** Re-encode a data-URL to JPEG at `quality` to reduce PDF file size. */
function reencodeJpeg(dataUrl: string, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d')!.drawImage(img, 0, 0);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '_');
}

/**
 * Export processed images into a multi-page PDF where
 * EACH IMAGE gets its own page sized to the image's pixel dimensions.
 * Triggers a browser download automatically.
 */
export async function exportAsPdf(
  items: PdfExportItem[],
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    quality = 0.92,
    title = 'واترمارک‌ها',
    onProgress,
  } = options;

  onProgress?.(0, 'در حال بارگذاری pdf-lib…');

  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor('واترمارک‌ساز');
  pdfDoc.setCreator('واترمارک‌ساز');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const pct = Math.round(((i + 1) / items.length) * 90);
    onProgress?.(pct, `در حال جاسازی تصویر ${i + 1} از ${items.length}…`);

    // Re-encode for smaller file size
    const encoded = quality < 1 ? await reencodeJpeg(item.dataUrl, quality) : item.dataUrl;
    const { w: imgW, h: imgH } = await getImageDimensions(encoded);

    // Embed image bytes
    const base64 = encoded.split(',')[1];
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    let embeddedImg;
    try {
      embeddedImg = encoded.includes('image/png')
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes);
    } catch {
      embeddedImg = await pdfDoc.embedJpg(bytes);
    }

    // Each image gets its own page at exact image pixel dimensions
    const page = pdfDoc.addPage([imgW, imgH]);
    page.drawImage(embeddedImg, { x: 0, y: 0, width: imgW, height: imgH });

    await new Promise((r) => setTimeout(r, 0));
  }

  onProgress?.(93, 'در حال تولید فایل PDF…');
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  onProgress?.(97, 'در حال آماده‌سازی دانلود…');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(title)}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);

  onProgress?.(100, 'خروجی PDF آماده دانلود است ✓');
}
