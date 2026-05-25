// Developed by @Alirewa — https://github.com/Alirewa
'use client';

export interface ZipExportItem {
  name: string;
  dataUrl: string;
}

export interface ZipExportOptions {
  compression?: 'DEFLATE' | 'STORE';
  compressionLevel?: number; // 1–9
  folderName?: string;
  /** If provided, files are named {baseName}_001.jpg, {baseName}_002.jpg… */
  baseName?: string;
  onProgress?: (pct: number, label: string) => void;
}

/**
 * Converts a base64 data-URL to a Uint8Array.
 * Strips the `data:image/...;base64,` prefix.
 */
function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Sanitise a filename: keep Unicode (Persian OK) but strip path chars. */
function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '_');
}

/** Export processed images as a ZIP archive and trigger browser download. */
export async function exportAsZip(
  items: ZipExportItem[],
  options: ZipExportOptions = {}
): Promise<void> {
  const {
    compression = 'DEFLATE',
    compressionLevel = 6,
    folderName = 'واترمارک‌ها',
    baseName,
    onProgress,
  } = options;

  onProgress?.(0, 'در حال بارگذاری JSZip…');

  // Lazy-load JSZip so it doesn't bloat the initial bundle
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  const folder = zip.folder(folderName) ?? zip;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const pct = Math.round(((i + 1) / items.length) * 70);
    onProgress?.(pct, `در حال افزودن تصویر ${i + 1} از ${items.length}…`);

    const bytes = dataUrlToBytes(item.dataUrl);
    const ext = item.dataUrl.includes('image/png') ? 'png' : 'jpg';
    const filename = baseName
      ? sanitizeFilename(`${baseName}_${String(i + 1).padStart(3, '0')}`)
      : sanitizeFilename(item.name || String(i + 1));
    folder.file(`${filename}.${ext}`, bytes, {
      compression,
      compressionOptions: { level: compressionLevel },
    });

    // yield to keep UI responsive
    await new Promise((r) => setTimeout(r, 0));
  }

  onProgress?.(75, 'در حال فشرده‌سازی…');

  const blob = await zip.generateAsync(
    {
      type: 'blob',
      compression,
      compressionOptions: { level: compressionLevel },
    },
    (meta) => {
      const p = 75 + Math.round(meta.percent * 0.2);
      onProgress?.(p, `در حال فشرده‌سازی ${Math.round(meta.percent)}٪`);
    }
  );

  onProgress?.(97, 'در حال آماده‌سازی فایل ZIP…');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(folderName)}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);

  onProgress?.(100, 'فایل ZIP آماده دانلود است ✓');
}
