// Developed by @Alirewa — https://github.com/Alirewa
/**
 * Strips EXIF/XMP/ICC metadata by re-drawing through a canvas.
 * Returns a new Blob with clean image data.
 */
export async function stripMetadata(
  file: File,
  quality = 0.95
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Failed to strip metadata')); return; }
          resolve({ blob, width: img.naturalWidth, height: img.naturalHeight });
        },
        mimeType,
        mimeType === 'image/jpeg' ? quality : undefined
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}
