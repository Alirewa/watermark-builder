// Developed by @Alirewa — https://github.com/Alirewa
import { create } from 'zustand';
import type { SidebarState, LicenseState, ToastItem, ModalConfig, UploadedFile, WatermarkConfig } from '@/types';
import { generateId } from '@/lib/utils';

/* ─── App Store (no persist middleware — avoids SSR issues) ───── */
interface AppState {
  // Sidebar
  sidebarState: SidebarState;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;

  // License
  license: LicenseState;
  setLicense: (license: LicenseState) => void;

  // Toast
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Uploads
  uploads: UploadedFile[];
  addUpload: (file: UploadedFile) => void;
  updateUpload: (id: string, update: Partial<UploadedFile>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;

  // Watermark config
  watermarkConfig: WatermarkConfig;
  setWatermarkConfig: (config: Partial<WatermarkConfig>) => void;
  resetWatermarkConfig: () => void;
}

const defaultWatermarkConfig: WatermarkConfig = {
  type: 'text',
  text: 'واترمارک',
  position: 'center',
  opacity: 0.5,
  scale: 1,
  rotation: -45,
  color: '#ffffff',
  fontSize: 48,
  fontFamily: 'Vazirmatn',
  tileMode: false,
};

export const useAppStore = create<AppState>()((set, get) => ({
  // Sidebar — default to collapsed so the studio gets full width
  sidebarState: 'collapsed',
  toggleSidebar: () =>
    set((s) => ({
      sidebarState: s.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
    })),
  setSidebarState: (state) => set({ sidebarState: state }),

  // License
  license: { status: 'idle', data: null },
  setLicense: (license) => set({ license }),

  // Toast
  toasts: [],
  addToast: (toast) => {
    const id = generateId();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => get().removeToast(id), duration);
    }
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),

  // Modal
  modals: [],
  openModal: (config) => {
    const id = generateId();
    set((s) => ({ modals: [...s.modals, { ...config, id }] }));
    return id;
  },
  closeModal: (id) =>
    set((s) => ({ modals: s.modals.filter((m) => m.id !== id) })),
  closeAllModals: () => set({ modals: [] }),

  // Uploads
  uploads: [],
  addUpload: (file) =>
    set((s) => ({ uploads: [...s.uploads, file] })),
  updateUpload: (id, update) =>
    set((s) => ({
      uploads: s.uploads.map((u) => (u.id === id ? { ...u, ...update } : u)),
    })),
  removeUpload: (id) =>
    set((s) => ({ uploads: s.uploads.filter((u) => u.id !== id) })),
  clearUploads: () => set({ uploads: [] }),

  // Watermark
  watermarkConfig: defaultWatermarkConfig,
  setWatermarkConfig: (config) =>
    set((s) => ({ watermarkConfig: { ...s.watermarkConfig, ...config } })),
  resetWatermarkConfig: () =>
    set({ watermarkConfig: defaultWatermarkConfig }),
}));
