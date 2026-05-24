'use client';

'use client';

import { GlassCard } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeSelector } from '@/components/layout/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Bell,
  Globe,
  Shield,
  Sliders,
  Monitor,
} from 'lucide-react';

const sections = [
  {
    id: 'appearance',
    label: 'ظاهر',
    icon: Palette,
  },
  {
    id: 'notifications',
    label: 'اعلان‌ها',
    icon: Bell,
  },
  {
    id: 'language',
    label: 'زبان و منطقه',
    icon: Globe,
  },
  {
    id: 'watermark',
    label: 'واترمارک',
    icon: Sliders,
  },
  {
    id: 'privacy',
    label: 'حریم خصوصی',
    icon: Shield,
  },
];

export function SettingsPanel() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">تنظیمات</h1>
        <p className="text-sm text-muted-foreground mt-1">
          شخصی‌سازی و پیکربندی نرم‌افزار
        </p>
      </div>

      {/* Appearance */}
      <SettingSection icon={Palette} title="ظاهر" description="تم و نمایش">
        <SettingRow
          label="حالت نمایش"
          description="انتخاب بین حالت روشن، تاریک یا سیستم"
        >
          <ThemeSelector />
        </SettingRow>
        <Separator />
        <SettingRow label="انیمیشن‌ها" description="نمایش انیمیشن‌های رابط کاربری">
          <Switch defaultChecked id="animations" />
        </SettingRow>
        <Separator />
        <SettingRow
          label="فشردگی فضا"
          description="نمایش فشرده‌تر رابط کاربری"
        >
          <Switch id="compact" />
        </SettingRow>
      </SettingSection>

      {/* Notifications */}
      <SettingSection icon={Bell} title="اعلان‌ها" description="کنترل نوتیفیکیشن‌ها">
        <SettingRow label="اعلان پردازش" description="نمایش اعلان پس از پایان پردازش">
          <Switch defaultChecked id="notif-processing" />
        </SettingRow>
        <Separator />
        <SettingRow label="صدای اعلان" description="پخش صدا هنگام نمایش اعلان">
          <Switch id="notif-sound" />
        </SettingRow>
      </SettingSection>

      {/* Watermark defaults */}
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

      {/* Privacy */}
      <SettingSection icon={Shield} title="حریم خصوصی" description="داده و امنیت">
        <SettingRow
          label="تحلیل‌گر ناشناس"
          description="ارسال داده‌های ناشناس برای بهبود نرم‌افزار"
        >
          <Switch defaultChecked id="analytics" />
        </SettingRow>
        <Separator />
        <SettingRow
          label="ذخیره تاریخچه"
          description="نگه‌داری سابقه پردازش تصاویر"
        >
          <Switch defaultChecked id="history" />
        </SettingRow>
      </SettingSection>

      {/* Version info */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="size-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">نسخه نرم‌افزار</p>
            <p className="text-xs text-muted-foreground">واترمارکر Pro</p>
          </div>
        </div>
        <Badge variant="default">v1.0.0</Badge>
      </GlassCard>
    </div>
  );
}

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
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="divide-y divide-border/50 px-5">{children}</div>
    </GlassCard>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
