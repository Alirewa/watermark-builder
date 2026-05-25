// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { create } from 'zustand';
import type {
  WatermarkMode,
  WatermarkPosition,
  TextWatermarkConfig,
  ImageWatermarkConfig,
  QRWatermarkConfig,
  WatermarkTemplate,
  HistoryEntry,
} from '@/types/watermark';
import {
  DEFAULT_TEXT_CONFIG,
  DEFAULT_IMAGE_CONFIG,
  DEFAULT_QR_CONFIG,
} from '@/types/watermark';
import { generateId } from '@/lib/utils';

const TEMPLATES_KEY = 'wm-templates';
const SETTINGS_KEY = 'wm-editor-settings';
const MAX_HISTORY = 50;

function loadTemplates(): WatermarkTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveTemplates(templates: WatermarkTemplate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

interface WatermarkEditorState {
  /* ── Image list ──────────────────────────────────────── */
  images: Array<{ id: string; name: string; url: string; size: number }>;
  activeImageId: string | null;
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (from: number, to: number) => void;
  setActiveImage: (id: string) => void;

  /* ── Watermark mode ──────────────────────────────────── */
  mode: WatermarkMode;
  setMode: (mode: WatermarkMode) => void;

  /* ── Text config ─────────────────────────────────────── */
  textConfig: TextWatermarkConfig;
  setTextConfig: (patch: Partial<TextWatermarkConfig>) => void;
  resetTextConfig: () => void;

  /* ── Image watermark config ──────────────────────────── */
  imageConfig: ImageWatermarkConfig;
  setImageConfig: (patch: Partial<ImageWatermarkConfig>) => void;
  setLogoUrl: (url: string) => void;

  /* ── QR config ───────────────────────────────────────── */
  qrConfig: QRWatermarkConfig;
  setQRConfig: (patch: Partial<QRWatermarkConfig>) => void;

  /* ── Position ────────────────────────────────────────── */
  position: WatermarkPosition;
  setPosition: (pos: WatermarkPosition) => void;
  tileSpacing: number;
  setTileSpacing: (n: number) => void;

  /* ── History ─────────────────────────────────────────── */
  history: HistoryEntry[];
  historyIndex: number;
  pushHistory: (json: string) => void;
  undoHistory: () => HistoryEntry | null;
  redoHistory: () => HistoryEntry | null;
  canUndo: boolean;
  canRedo: boolean;

  /* ── Templates ───────────────────────────────────────── */
  templates: WatermarkTemplate[];
  saveTemplate: (name: string) => void;
  deleteTemplate: (id: string) => void;
  applyTemplate: (id: string) => void;

  /* ── UI state ────────────────────────────────────────── */
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;

  /* ── Hydrate from localStorage ───────────────────────── */
  hydrate: () => void;
}

export const useWatermarkStore = create<WatermarkEditorState>()((set, get) => ({
  /* ── Images ────────────────────────────────────────────── */
  images: [],
  activeImageId: null,

  addImages: (files) => {
    const newImages = files.map((file) => ({
      id: generateId(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    set((s) => {
      const merged = [...s.images, ...newImages];
      const activeImageId = s.activeImageId ?? newImages[0]?.id ?? null;
      return { images: merged, activeImageId };
    });
  },

  removeImage: (id) =>
    set((s) => {
      const images = s.images.filter((i) => i.id !== id);
      // revoke object URL to avoid memory leaks
      const removed = s.images.find((i) => i.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      const activeImageId =
        s.activeImageId === id ? (images[0]?.id ?? null) : s.activeImageId;
      return { images, activeImageId };
    }),

  reorderImages: (from, to) =>
    set((s) => {
      const images = [...s.images];
      const [item] = images.splice(from, 1);
      images.splice(to, 0, item);
      return { images };
    }),

  setActiveImage: (id) => set({ activeImageId: id }),

  /* ── Mode ─────────────────────────────────────────────── */
  mode: 'text',
  setMode: (mode) => set({ mode }),

  /* ── Text config ──────────────────────────────────────── */
  textConfig: { ...DEFAULT_TEXT_CONFIG },
  setTextConfig: (patch) =>
    set((s) => {
      const textConfig = { ...s.textConfig, ...patch };
      _autosaveSettings({ textConfig, mode: s.mode, position: s.position });
      return { textConfig };
    }),
  resetTextConfig: () => set({ textConfig: { ...DEFAULT_TEXT_CONFIG } }),

  /* ── Image watermark ──────────────────────────────────── */
  imageConfig: { ...DEFAULT_IMAGE_CONFIG },
  setImageConfig: (patch) =>
    set((s) => ({ imageConfig: { ...s.imageConfig, ...patch } })),
  setLogoUrl: (url) =>
    set((s) => ({ imageConfig: { ...s.imageConfig, url } })),

  /* ── QR config ────────────────────────────────────────── */
  qrConfig: { ...DEFAULT_QR_CONFIG },
  setQRConfig: (patch) =>
    set((s) => ({ qrConfig: { ...s.qrConfig, ...patch } })),

  /* ── Position ─────────────────────────────────────────── */
  position: 'center',
  setPosition: (position) => {
    set({ position });
    _autosaveSettings({ position, mode: get().mode, textConfig: get().textConfig });
  },
  tileSpacing: 60,
  setTileSpacing: (tileSpacing) => set({ tileSpacing }),

  /* ── History ──────────────────────────────────────────── */
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  pushHistory: (json) =>
    set((s) => {
      const truncated = s.history.slice(0, s.historyIndex + 1);
      const history = [
        ...truncated,
        { canvasJson: json, timestamp: Date.now() },
      ].slice(-MAX_HISTORY);
      const historyIndex = history.length - 1;
      return {
        history,
        historyIndex,
        canUndo: historyIndex > 0,
        canRedo: false,
      };
    }),

  undoHistory: () => {
    const s = get();
    if (s.historyIndex <= 0) return null;
    const historyIndex = s.historyIndex - 1;
    set({ historyIndex, canUndo: historyIndex > 0, canRedo: true });
    return s.history[historyIndex] ?? null;
  },

  redoHistory: () => {
    const s = get();
    if (s.historyIndex >= s.history.length - 1) return null;
    const historyIndex = s.historyIndex + 1;
    set({
      historyIndex,
      canUndo: true,
      canRedo: historyIndex < s.history.length - 1,
    });
    return s.history[historyIndex] ?? null;
  },

  /* ── Templates ────────────────────────────────────────── */
  templates: [],

  saveTemplate: (name) => {
    const s = get();
    const t: WatermarkTemplate = {
      id: generateId(),
      name,
      mode: s.mode,
      text: s.mode === 'text' ? { ...s.textConfig } : undefined,
      image: s.mode === 'image' ? { ...s.imageConfig } : undefined,
      qr: s.mode === 'qr' ? { ...s.qrConfig } : undefined,
      position: s.position,
      tileSpacing: s.tileSpacing,
      createdAt: new Date().toISOString(),
    };
    const templates = [...s.templates, t];
    saveTemplates(templates);
    set({ templates });
  },

  deleteTemplate: (id) => {
    const templates = get().templates.filter((t) => t.id !== id);
    saveTemplates(templates);
    set({ templates });
  },

  applyTemplate: (id) => {
    const t = get().templates.find((tmpl) => tmpl.id === id);
    if (!t) return;
    set({
      mode: t.mode,
      ...(t.text ? { textConfig: { ...t.text } } : {}),
      ...(t.image ? { imageConfig: { ...t.image } } : {}),
      ...(t.qr ? { qrConfig: { ...t.qr } } : {}),
      position: t.position,
      ...(t.tileSpacing != null ? { tileSpacing: t.tileSpacing } : {}),
    });
  },

  /* ── UI state ─────────────────────────────────────────── */
  compareMode: false,
  setCompareMode: (compareMode) => set({ compareMode }),
  isProcessing: false,
  setIsProcessing: (isProcessing) => set({ isProcessing }),

  /* ── Hydrate ──────────────────────────────────────────── */
  hydrate: () => {
    const templates = loadTemplates();
    const settings = _loadSettings();
    set({
      templates,
      ...(settings?.textConfig ? { textConfig: settings.textConfig } : {}),
      ...(settings?.position ? { position: settings.position } : {}),
    });
  },
}));

/* ─── Auto-save helpers ──────────────────────────────────────── */
function _autosaveSettings(partial: Partial<{ textConfig: TextWatermarkConfig; mode: WatermarkMode; position: WatermarkPosition }>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = _loadSettings() ?? {};
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, ...partial }));
  } catch {}
}

function _loadSettings() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null');
  } catch {
    return null;
  }
}
