/* ─── App Types ───────────────────────────────────────────────── */

export type Theme = 'light' | 'dark' | 'system';

export type SidebarState = 'expanded' | 'collapsed';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
};

/* ─── License Types ───────────────────────────────────────────── */
export type LicenseStatus = 'idle' | 'checking' | 'valid' | 'invalid' | 'expired';

export type LicenseData = {
  key: string;
  activatedAt: string;
  expiresAt?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  deviceId?: string;
};

export type LicenseState = {
  status: LicenseStatus;
  data: LicenseData | null;
  error?: string;
};

/* ─── Upload Types ────────────────────────────────────────────── */
export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  preview?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  progress?: number;
};

/* ─── Watermark Types ─────────────────────────────────────────── */
export type WatermarkType = 'text' | 'image' | 'qr';

export type WatermarkPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export type WatermarkConfig = {
  type: WatermarkType;
  text?: string;
  imageUrl?: string;
  position: WatermarkPosition;
  opacity: number;
  scale: number;
  rotation: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  tileMode?: boolean;
};

/* ─── Toast Types ─────────────────────────────────────────────── */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

/* ─── Modal Types ─────────────────────────────────────────────── */
export type ModalConfig = {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
};

/* ─── API Response ────────────────────────────────────────────── */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
