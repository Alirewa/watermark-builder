// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { StoreHydrator } from '@/components/shared/StoreHydrator';
import { DirectionSetter } from '@/components/shared/DirectionSetter';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { ModalContainer } from '@/components/shared/ModalContainer';
import { ExportProgressModal } from '@/components/export/ExportProgressModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <StoreHydrator />
      <DirectionSetter />
    <div className="h-screen overflow-hidden bg-brand-mesh flex">
      {/* Sidebar — fixed on mobile, in-flow on desktop */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content — scrolls independently inside the viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 py-5 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {children}
          </motion.div>
        </main>

        <Footer />
      </div>

      {/* Global overlays */}
      <ToastContainer />
      <ModalContainer />
      <ExportProgressModal />
    </div>
    </>
  );
}
