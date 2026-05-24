import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeWrapper } from '@/components/shared/ThemeWrapper';

export const metadata: Metadata = {
  title: {
    default: 'واترمارکر — ابزار حرفه‌ای واترمارک',
    template: '%s | واترمارکر',
  },
  description: 'سرویس حرفه‌ای اعمال واترمارک روی تصاویر با پشتیبانی کامل از زبان فارسی',
  keywords: ['واترمارک', 'watermark', 'تصویر', 'image'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#080f1e' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
