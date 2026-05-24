'use client';

import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  checkLicenseKey,
  clearLicense,
  getDeviceId,
  saveLicense,
} from '@/utils/license';
import { sleep } from '@/lib/utils';
import type { LicenseData } from '@/types';

export function useLicense() {
  const { license, setLicense, addToast } = useAppStore();

  // License is hydrated globally by StoreHydrator — nothing needed here

  const activate = useCallback(
    async (key: string) => {
      setLicense({ status: 'checking', data: null });
      await sleep(1500); // Simulate network check

      const status = checkLicenseKey(key);

      if (status === 'valid') {
        const data: LicenseData = {
          key,
          activatedAt: new Date().toISOString(),
          plan: 'pro',
          deviceId: getDeviceId(),
        };
        saveLicense(data);
        setLicense({ status: 'valid', data });
        addToast({
          type: 'success',
          title: 'لایسنس فعال شد',
          description: 'حساب شما با موفقیت فعال‌سازی شد.',
        });
      } else {
        setLicense({ status: 'invalid', data: null, error: 'کلید لایسنس نامعتبر است' });
        addToast({
          type: 'error',
          title: 'لایسنس نامعتبر',
          description: 'کلید وارد شده معتبر نیست. لطفاً دوباره بررسی کنید.',
        });
      }
    },
    [setLicense, addToast]
  );

  const deactivate = useCallback(() => {
    clearLicense();
    setLicense({ status: 'idle', data: null });
    addToast({ type: 'info', title: 'لایسنس غیرفعال شد' });
  }, [setLicense, addToast]);

  return {
    license,
    isActive: license.status === 'valid',
    isChecking: license.status === 'checking',
    activate,
    deactivate,
  };
}
