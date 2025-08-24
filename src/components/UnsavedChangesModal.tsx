'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useFormDirty } from '@/contexts/FormDirtyContext';

export const UnsavedChangesModal: React.FC = () => {
  const {
    showUnsavedChangesModal,
    setShowUnsavedChangesModal,
    confirmAndExecute,
    cancelPendingAction,
  } = useFormDirty();

  return (
    <Dialog open={showUnsavedChangesModal} onOpenChange={setShowUnsavedChangesModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Nesnimljene izmene
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Imaš nesnimljene izmene. Ako nastaviš, izgubićeš sve promene. Da li sigurno želiš da napustiš ovu stranicu?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={cancelPendingAction}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Otkaži
          </Button>
          <Button
            onClick={confirmAndExecute}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Napusti stranicu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 