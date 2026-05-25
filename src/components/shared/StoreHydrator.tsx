// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { loadLicense, isLicenseExpired } from '@/utils/license';

const STORE_KEY = 'wm-app-store';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(state: { sidebarState: string; watermarkConfig: unknown }) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function StoreHydrator() {
  const { setSidebarState, setWatermarkConfig, setLicense } = useAppStore();

  useEffect(() => {
    // Rehydrate persisted UI prefs
    const saved = loadFromStorage();
    if (saved?.sidebarState) setSidebarState(saved.sidebarState);
    if (saved?.watermarkConfig) setWatermarkConfig(saved.watermarkConfig);

    // Rehydrate license from its own key
    const licenseData = loadLicense();
    if (licenseData) {
      if (isLicenseExpired(licenseData)) {
        setLicense({ status: 'expired', data: licenseData });
      } else {
        setLicense({ status: 'valid', data: licenseData });
      }
    }

    // Subscribe to persist UI prefs on change
    const unsub = useAppStore.subscribe((state) => {
      saveToStorage({
        sidebarState: state.sidebarState,
        watermarkConfig: state.watermarkConfig,
      });
    });

    return unsub;
  }, [setSidebarState, setWatermarkConfig, setLicense]);

  return null;
}
