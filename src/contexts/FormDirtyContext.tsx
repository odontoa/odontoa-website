'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface FormDirtyContextType {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  showUnsavedChangesModal: boolean;
  setShowUnsavedChangesModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
  confirmAndExecute: () => void;
  cancelPendingAction: () => void;
}

const FormDirtyContext = createContext<FormDirtyContextType | undefined>(undefined);

export const useFormDirty = () => {
  const context = useContext(FormDirtyContext);
  if (context === undefined) {
    throw new Error('useFormDirty must be used within a FormDirtyProvider');
  }
  return context;
};

interface FormDirtyProviderProps {
  children: React.ReactNode;
}

export const FormDirtyProvider: React.FC<FormDirtyProviderProps> = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const setDirty = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const confirmAndExecute = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    setShowUnsavedChangesModal(false);
    setPendingAction(null);
    setIsDirty(false);
  }, [pendingAction]);

  const cancelPendingAction = useCallback(() => {
    setShowUnsavedChangesModal(false);
    setPendingAction(null);
  }, []);

  const value: FormDirtyContextType = {
    isDirty,
    setDirty,
    showUnsavedChangesModal,
    setShowUnsavedChangesModal,
    pendingAction,
    setPendingAction,
    confirmAndExecute,
    cancelPendingAction,
  };

  return (
    <FormDirtyContext.Provider value={value}>
      {children}
    </FormDirtyContext.Provider>
  );
}; 