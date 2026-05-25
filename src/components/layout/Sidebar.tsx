// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Droplets, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mainNavItems, bottomNavItems } from './nav-items';
import { useT } from '@/hooks/useT';
import type { NavItem } from '@/types';

/* ─── Nav Item ────────────────────────────────────────────────── */
function SidebarNavItem({
  item,
  collapsed,
  isRTL,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  isRTL: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
        'transition-all duration-150 relative select-none',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
        collapsed && 'justify-center px-2'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-primary/10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
        />
      )}

      <Icon
        className={cn(
          'shrink-0 transition-colors relative z-10',
          collapsed ? 'size-5' : 'size-4',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />

      {!collapsed && (
        <span className="overflow-hidden whitespace-nowrap relative z-10 flex-1 min-w-0 truncate">
          {item.label}
        </span>
      )}

      {!collapsed && item.badge && (
        <Badge
          variant="default"
          className="me-auto text-[10px] py-0 px-1.5 h-4 relative z-10 shrink-0"
        >
          {item.badge}
        </Badge>
      )}

      {/* Tooltip — appears toward the content area */}
      {collapsed && (
        <span
          className={cn(
            'absolute px-2.5 py-1 rounded-lg bg-popover border border-border',
            'text-foreground text-xs whitespace-nowrap',
            'opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50',
            isRTL ? 'right-full me-2' : 'left-full ms-2'
          )}
        >
          {item.label}
        </span>
      )}
    </Link>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────── */
interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const { sidebarState, toggleSidebar } = useAppStore();
  const isMobile = useIsMobile();
  const { t, lang } = useT();
  const isRTL = lang === 'fa';
  const collapsed = !isMobile && sidebarState === 'collapsed';
  const desktopWidth = collapsed ? 72 : 260;

  /* Translate nav labels dynamically */
  const navMap: Record<string, string> = {
    dashboard: t.nav.dashboard,
    watermark: t.nav.watermark,
    settings: t.nav.settings,
  };
  const translateItem = (item: NavItem): NavItem => ({
    ...item,
    label: navMap[item.id] ?? item.label,
  });

  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────────── */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={
          isMobile
            ? { x: mobileOpen ? 0 : isRTL ? 280 : -280 }
            : { width: desktopWidth, x: 0 }
        }
        transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
        className={cn(
          'flex flex-col h-full',
          'glass border-s border-border',
          'fixed top-0 z-50',
          'lg:relative lg:z-auto'
        )}
        style={{
          /* Switch physical side based on direction */
          [isRTL ? 'right' : 'left']: 0,
          width: isMobile ? 260 : undefined,
        }}
      >
        {/* ── Logo / Brand ─────────────────────────────── */}
        <div
          className={cn(
            'flex items-center border-b border-border shrink-0',
            'h-[var(--header-height,64px)]',
            collapsed ? 'justify-center px-3' : 'justify-between px-4'
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
              <Droplets className="size-4 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-bold text-sm leading-tight whitespace-nowrap">
                  {t.header.brand}
                </p>
              </div>
            )}
          </Link>

          {isMobile ? (
            <button
              onClick={onMobileClose}
              className="rounded-xl p-1.5 hover:bg-accent transition-colors text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          ) : (
            !collapsed && (
              <button
                onClick={toggleSidebar}
                className="rounded-xl p-1.5 hover:bg-accent transition-colors text-muted-foreground"
                title={t.header.collapseMenu}
              >
                {/* Arrow points inward toward content */}
                <ChevronLeft className={cn('size-4', !isRTL && 'rotate-180')} />
              </button>
            )
          )}
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <ScrollArea className="flex-1 py-2 px-2">
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={translateItem(item)}
                collapsed={collapsed}
                isRTL={isRTL}
                onNavigate={isMobile ? onMobileClose : undefined}
              />
            ))}
          </nav>

          <Separator className="my-3 mx-1 opacity-50" />

          <nav className="space-y-0.5">
            {bottomNavItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={translateItem(item)}
                collapsed={collapsed}
                isRTL={isRTL}
                onNavigate={isMobile ? onMobileClose : undefined}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* ── Collapsed expand button ───────────────────── */}
        {collapsed && !isMobile && (
          <div className="p-2 border-t border-border shrink-0">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center rounded-xl p-2.5 hover:bg-accent transition-colors text-muted-foreground"
              title={t.header.expandMenu}
            >
              <ChevronLeft className={cn('size-4', isRTL ? 'rotate-180' : 'rotate-0')} />
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
