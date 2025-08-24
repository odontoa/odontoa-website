import { useCallback } from 'react';
import { useFormDirty } from '@/contexts/FormDirtyContext';

export const useProtectedAction = () => {
  const { isDirty, setShowUnsavedChangesModal, setPendingAction } = useFormDirty();

  const executeProtectedAction = useCallback((action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action);
      setShowUnsavedChangesModal(true);
    } else {
      action();
    }
  }, [isDirty, setPendingAction, setShowUnsavedChangesModal]);

  return { executeProtectedAction, isDirty };
}; 