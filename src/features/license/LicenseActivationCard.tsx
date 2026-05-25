// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';
import { useLicense } from '@/hooks/useLicense';
import { validateLicenseFormat } from '@/utils/license';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function LicenseActivationCard() {
  const { license, isActive, isChecking, activate, deactivate } = useLicense();
  const [key, setKey] = useState('');
  const [formatError, setFormatError] = useState('');

  const handleKeyChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setKey(formatted);
    if (formatError) setFormatError('');
  };

  const handleActivate = async () => {
    if (!validateLicenseFormat(key)) {
      setFormatError('فرمت کلید نادرست است. مثال: XXXXX-XXXX-XXXXX-XXXX');
      return;
    }
    await activate(key);
    if (license.status !== 'valid') setKey('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {isActive ? (
          <ActiveState key="active" onDeactivate={deactivate} data={license.data} />
        ) : (
          <InactiveState
            key="inactive"
            keyValue={key}
            onKeyChange={handleKeyChange}
            onActivate={handleActivate}
            isChecking={isChecking}
            isInvalid={license.status === 'invalid'}
            formatError={formatError}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Inactive / Activation Form ─────────────────────────────── */
function InactiveState({
  keyValue,
  onKeyChange,
  onActivate,
  isChecking,
  isInvalid,
  formatError,
}: {
  keyValue: string;
  onKeyChange: (v: string) => void;
  onActivate: () => void;
  isChecking: boolean;
  isInvalid: boolean;
  formatError: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', bounce: 0.3 }}
    >
      <GlassCard className="p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -end-24 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="size-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow"
          >
            <Lock className="size-7 text-white" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-1">فعال‌سازی لایسنس</h2>
          <p className="text-sm text-muted-foreground">
            برای دسترسی به تمام قابلیت‌ها، کلید لایسنس خود را وارد کنید
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 relative z-10">
          <Input
            label="کلید لایسنس"
            placeholder="XXXXX-XXXX-XXXXX-XXXX"
            value={keyValue}
            onChange={(e) => onKeyChange(e.target.value)}
            startIcon={<Key className="size-4" />}
            error={
              isInvalid
                ? 'کلید لایسنس نامعتبر است'
                : formatError || undefined
            }
            className={cn(
              'font-mono tracking-widest text-center ltr',
              isInvalid && 'border-destructive'
            )}
            dir="ltr"
            disabled={isChecking}
          />

          <Button
            className="w-full"
            size="lg"
            variant="brand"
            onClick={onActivate}
            loading={isChecking}
            disabled={!keyValue || isChecking}
          >
            {isChecking ? (
              'در حال بررسی...'
            ) : (
              <>
                <Sparkles className="size-4" />
                فعال‌سازی لایسنس
              </>
            )}
          </Button>
        </div>

        {/* Feature list */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center mb-3">
            با فعال‌سازی لایسنس دسترسی خواهید داشت به:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'پردازش نامحدود',
              'واترمارک پیشرفته',
              'خروجی HD',
              'پشتیبانی اولویت‌دار',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ─── Active State ────────────────────────────────────────────── */
function ActiveState({
  data,
  onDeactivate,
}: {
  data: ReturnType<typeof useLicense>['license']['data'];
  onDeactivate: () => void;
}) {
  const activatedAt = data?.activatedAt
    ? new Date(data.activatedAt).toLocaleDateString('fa-IR')
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', bounce: 0.4 }}
    >
      <GlassCard className="p-8 relative overflow-hidden border-emerald-500/30">
        {/* Success glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -end-20 size-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Animated check */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
          >
            <Unlock className="size-7 text-white" />
          </motion.div>
        </div>

        <div className="text-center mb-6 relative z-10">
          <Badge variant="success" dot className="mb-3">
            لایسنس فعال
          </Badge>
          <h2 className="text-xl font-bold mb-1">تبریک!</h2>
          <p className="text-sm text-muted-foreground">
            لایسنس شما با موفقیت فعال شده است
          </p>
        </div>

        {/* License info */}
        <div className="space-y-3 relative z-10 mb-6">
          <InfoRow label="پلن" value={data?.plan === 'pro' ? 'حرفه‌ای (Pro)' : data?.plan ?? '—'} />
          <InfoRow
            label="کلید لایسنس"
            value={maskKey(data?.key ?? '')}
            mono
          />
          <InfoRow label="تاریخ فعال‌سازی" value={activatedAt} />
          <InfoRow label="وضعیت" value="فعال و معتبر" success />
        </div>

        <Button
          variant="outline"
          className="w-full text-muted-foreground"
          size="sm"
          onClick={onDeactivate}
        >
          <XCircle className="size-3.5" />
          غیرفعال کردن لایسنس
        </Button>
      </GlassCard>
    </motion.div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  success,
}: {
  label: string;
  value: string;
  mono?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          'text-xs font-medium',
          mono && 'font-mono tracking-wider ltr',
          success && 'text-emerald-600 dark:text-emerald-400'
        )}
        dir={mono ? 'ltr' : 'rtl'}
      >
        {value}
      </span>
    </div>
  );
}

function maskKey(key: string): string {
  if (!key) return '—';
  const parts = key.split('-');
  return parts.map((p, i) => (i === parts.length - 1 ? '****' : p)).join('-');
}
