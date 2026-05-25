// Developed by @Alirewa — https://github.com/Alirewa
import { LayoutDashboard, Layers, Settings } from 'lucide-react';
import type { NavItem } from '@/types';

export const mainNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'داشبورد',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'watermark',
    label: 'واترمارک',
    href: '/watermark',
    icon: Layers,
  },
];

export const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    label: 'تنظیمات',
    href: '/settings',
    icon: Settings,
  },
];
