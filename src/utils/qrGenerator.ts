import type { QRWatermarkConfig } from '@/types/watermark';

export async function generateQRDataUrl(config: QRWatermarkConfig): Promise<string> {
  const QRCode = (await import('qrcode')).default;

  const dataUrl = await QRCode.toDataURL(config.content || 'https://example.com', {
    width: config.size * 2, // 2x for HiDPI
    margin: config.margin,
    color: {
      dark: config.foreground,
      light: config.background === 'transparent' ? '#00000000' : config.background,
    },
    errorCorrectionLevel: 'M',
  });

  return dataUrl;
}
