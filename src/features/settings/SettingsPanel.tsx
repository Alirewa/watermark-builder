// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { GlassCard } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeSelector } from '@/components/layout/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Palette,
  Bell,
  Sliders,
  Monitor,
  Shield,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
export function SettingsPanel() {
  return (
    <div className="max-w-3xl space-y-4 sm:space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">تنظیمات</h1>
        <p className="text-sm text-muted-foreground mt-1">
          شخصی‌سازی و پیکربندی نرم‌افزار
        </p>
      </div>

      {/* ── Appearance ──────────────────────────────────────── */}
      <SettingSection icon={Palette} title="ظاهر" description="تم و نمایش">

        {/* Theme selector — full-width stacked row for mobile */}
        <SettingRow
          label="حالت نمایش"
          description="انتخاب بین حالت روشن، تاریک یا سیستم"
          stacked
        >
          <ThemeSelector />
        </SettingRow>

        <Separator />

        <SettingRow label="انیمیشن‌ها" description="نمایش انیمیشن‌های رابط کاربری">
          <Switch defaultChecked id="animations" />
        </SettingRow>

        <Separator />

        <SettingRow label="فشردگی فضا" description="نمایش فشرده‌تر رابط کاربری">
          <Switch id="compact" />
        </SettingRow>

      </SettingSection>

      {/* ── Notifications ───────────────────────────────────── */}
      <SettingSection icon={Bell} title="اعلان‌ها" description="کنترل نوتیفیکیشن‌ها">

        <SettingRow label="اعلان پردازش" description="نمایش اعلان پس از پایان پردازش">
          <Switch defaultChecked id="notif-processing" />
        </SettingRow>

        <Separator />

        <SettingRow label="صدای اعلان" description="پخش صدا هنگام نمایش اعلان">
          <Switch id="notif-sound" />
        </SettingRow>

      </SettingSection>

      {/* ── Watermark defaults ──────────────────────────────── */}
      <SettingSection icon={Sliders} title="پیش‌فرض واترمارک" description="تنظیمات پیش‌فرض">

        <SettingRow
          label="ذخیره تنظیمات آخر"
          description="تنظیمات واترمارک آخرین بار استفاده‌شده را ذخیره کن"
        >
          <Switch defaultChecked id="save-last" />
        </SettingRow>

        <Separator />

        <SettingRow
          label="واترمارک پیش‌فرض"
          description="استفاده از قالب پیش‌فرض برای واترمارک جدید"
        >
          <Switch id="default-wm" />
        </SettingRow>

      </SettingSection>

      {/* ── Privacy ─────────────────────────────────────────── */}
      <SettingSection icon={Shield} title="حریم خصوصی" description="داده و امنیت">

        <SettingRow
          label="تحلیل‌گر ناشناس"
          description="ارسال داده‌های ناشناس برای بهبود نرم‌افزار"
        >
          <Switch defaultChecked id="analytics" />
        </SettingRow>

        <Separator />

        <SettingRow label="ذخیره تاریخچه" description="نگه‌داری سابقه پردازش تصاویر">
          <Switch defaultChecked id="history" />
        </SettingRow>

      </SettingSection>

      {/* ── Version card ────────────────────────────────────── */}
      <GlassCard className="p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Monitor className="size-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium">نسخه نرم‌افزار</p>
            <p className="text-xs text-muted-foreground">واترمارکر Pro</p>
          </div>
        </div>
        <Badge variant="default" className="shrink-0">v1.0.0</Badge>
      </GlassCard>

    </div>
  );
}

/* ─── Section wrapper ─────────────────────────────────────── */
function SettingSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard>
      {/* Section header */}
      <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-border">
        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="size-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50 px-3 sm:px-5">{children}</div>
    </GlassCard>
  );
}

/* ─── Setting row ─────────────────────────────────────────── */
function SettingRow({
  label,
  description,
  children,
  stacked = false,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        'py-4 gap-3',
        stacked
          /* stacked: label on top, control below (ThemeSelector) */
          ? 'flex flex-col items-start'
          /* inline: label left, control right (Switch) */
          : 'flex items-center justify-between gap-4'
      )}
    >
      <div className="min-w-0">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className={cn('shrink-0', stacked && 'self-start')}>{children}</div>
    </div>
  );
}
