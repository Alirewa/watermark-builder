/* ─── Watermark Types ──────────────────────────────────────────── */

export type WatermarkMode = 'text' | 'image' | 'qr';

export type WatermarkPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'middle-right'
  | 'center'
  | 'middle-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'tile';

export interface TextWatermarkConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  color: string;
  opacity: number;
  rotation: number;
  letterSpacing: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
}

export interface ImageWatermarkConfig {
  url: string;
  scale: number;
  opacity: number;
  rotation: number;
}

export interface QRWatermarkConfig {
  content: string;
  size: number;
  opacity: number;
  foreground: string;
  background: string;
  margin: number;
}

export interface WatermarkPosition2D {
  x: number;
  y: number;
}

export interface WatermarkTemplate {
  id: string;
  name: string;
  mode: WatermarkMode;
  text?: TextWatermarkConfig;
  image?: ImageWatermarkConfig;
  qr?: QRWatermarkConfig;
  position: WatermarkPosition;
  customPosition?: WatermarkPosition2D;
  tileSpacing?: number;
  createdAt: string;
}

export interface ProcessedImage {
  id: string;
  originalName: string;
  dataUrl: string;
  width: number;
  height: number;
}

export type HistoryEntry = {
  canvasJson: string;
  timestamp: number;
};

export const FONT_FAMILIES = [
  { value: 'Vazirmatn', label: 'وزیرمتن' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Impact', label: 'Impact' },
] as const;

export const DEFAULT_TEXT_CONFIG: TextWatermarkConfig = {
  text: 'واترمارک',
  fontFamily: 'Vazirmatn',
  fontSize: 64,
  bold: false,
  italic: false,
  color: '#ffffff',
  opacity: 0.6,
  rotation: -30,
  letterSpacing: 4,
  shadowEnabled: true,
  shadowColor: 'rgba(0,0,0,0.5)',
  shadowBlur: 8,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  strokeEnabled: false,
  strokeColor: '#000000',
  strokeWidth: 1,
};

export const DEFAULT_IMAGE_CONFIG: ImageWatermarkConfig = {
  url: '',
  scale: 0.25,
  opacity: 0.7,
  rotation: 0,
};

export const DEFAULT_QR_CONFIG: QRWatermarkConfig = {
  content: 'https://example.com',
  size: 120,
  opacity: 0.8,
  foreground: '#000000',
  background: 'transparent',
  margin: 1,
};

/* ─── Template-based Placement ─────────────────────────────────── */

export interface TemplatePosition {
  /** 0–1 relative to image width */
  x: number;
  /** 0–1 relative to image height */
  y: number;
}

export interface PlacementTemplate {
  id: string;
  label: string;
  positions: TemplatePosition[];
}

export interface WatermarkOptions {
  templateId: string;
  /** Opacity 0.1–1.0 */
  opacity: number;
  /** Watermark width as fraction of min(imageW, imageH) */
  sizeRatio: number;
}

export const PLACEMENT_TEMPLATES: PlacementTemplate[] = [
  {
    id: 'triangle',
    label: 'مثلث',
    positions: [
      { x: 0.50, y: 0.18 }, // بالا-مرکز
      { x: 0.20, y: 0.78 }, // پایین-چپ
      { x: 0.80, y: 0.78 }, // پایین-راست
    ],
  },
  {
    id: 'diagonal',
    label: 'قطری',
    positions: [
      { x: 0.82, y: 0.18 }, // بالا-راست
      { x: 0.50, y: 0.50 }, // مرکز
      { x: 0.18, y: 0.82 }, // پایین-چپ
    ],
  },
  {
    id: 'corners',
    label: 'گوشه‌ها',
    positions: [
      { x: 0.20, y: 0.18 }, // بالا-چپ
      { x: 0.80, y: 0.18 }, // بالا-راست
      { x: 0.50, y: 0.82 }, // پایین-مرکز
    ],
  },
  {
    id: 'horizontal',
    label: 'افقی',
    positions: [
      { x: 0.18, y: 0.50 }, // چپ
      { x: 0.50, y: 0.50 }, // مرکز
      { x: 0.82, y: 0.50 }, // راست
    ],
  },
];

export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  templateId: 'triangle',
  opacity: 0.45,
  sizeRatio: 0.19,
};
