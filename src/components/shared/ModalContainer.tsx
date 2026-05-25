// Developed by @Alirewa — https://github.com/Alirewa
'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ModalContainer() {
  const { modals, closeModal } = useAppStore();

  return (
    <>
      {modals.map((modal) => (
        <Dialog
          key={modal.id}
          open
          onOpenChange={(open) => !open && closeModal(modal.id)}
        >
          <DialogContent size={modal.size ?? 'md'}>
            <DialogHeader>
              <DialogTitle>{modal.title}</DialogTitle>
              {modal.description && (
                <DialogDescription>{modal.description}</DialogDescription>
              )}
            </DialogHeader>

            {modal.content && <div className="py-2">{modal.content}</div>}

            <DialogFooter>
              {modal.onConfirm && (
                <Button
                  variant={modal.variant === 'destructive' ? 'destructive' : 'default'}
                  onClick={() => {
                    modal.onConfirm?.();
                    closeModal(modal.id);
                  }}
                >
                  {modal.confirmLabel ?? 'تأیید'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  modal.onCancel?.();
                  closeModal(modal.id);
                }}
              >
                {modal.cancelLabel ?? 'انصراف'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
