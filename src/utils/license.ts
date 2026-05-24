import type { LicenseData, LicenseStatus } from '@/types';

const LICENSE_STORAGE_KEY = 'wm_license';
const VALID_LICENSE_KEY = 'BIMFAA-2026-WATER-X9QK';

export function validateLicenseFormat(key: string): boolean {
  // Format: XXXXXX-XXXX-XXXXX-XXXX
  const pattern = /^[A-Z0-9]{6}-[A-Z0-9]{4}-[A-Z0-9]{5}-[A-Z0-9]{4}$/;
  return pattern.test(key.trim().toUpperCase());
}

export function checkLicenseKey(key: string): LicenseStatus {
  const normalized = key.trim().toUpperCase();
  if (normalized === VALID_LICENSE_KEY) return 'valid';
  return 'invalid';
}

export function saveLicense(data: LicenseData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(data));
}

export function loadLicense(): LicenseData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LicenseData;
  } catch {
    return null;
  }
}

export function clearLicense(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LICENSE_STORAGE_KEY);
}

export function isLicenseExpired(data: LicenseData): boolean {
  if (!data.expiresAt) return false;
  return new Date(data.expiresAt) < new Date();
}

export function getLicensePlanLabel(plan: LicenseData['plan']): string {
  const labels: Record<LicenseData['plan'], string> = {
    starter: 'استارتر',
    pro: 'حرفه‌ای',
    enterprise: 'سازمانی',
  };
  return labels[plan];
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('wm_device_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('wm_device_id', id);
  }
  return id;
}
