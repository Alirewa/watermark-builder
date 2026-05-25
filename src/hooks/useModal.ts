// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useAppStore } from '@/store/useAppStore';
import type { ModalConfig } from '@/types';

export function useModal() {
  const { openModal, closeModal, closeAllModals, modals } = useAppStore();

  const confirm = (config: Omit<ModalConfig, 'id'>) => openModal(config);

  return { confirm, openModal, closeModal, closeAllModals, modals };
}
