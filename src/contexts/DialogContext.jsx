import React, { createContext, useContext } from 'react';
import useDialog from '../hooks/useDialog';
import SuccessDialog from '../components/dialogs/SuccessDialog';
import ErrorDialog from '../components/dialogs/ErrorDialog';

// Create context
const DialogContext = createContext(null);

// Provider component
export const DialogProvider = ({ children }) => {
  const dialog = useDialog();
  const { dialogState, hideDialog } = dialog;

  return (
    <DialogContext.Provider value={dialog}>
      {children}

      {/* Success Dialog */}
      {dialogState.open && dialogState.type === 'success' && (
        <SuccessDialog
          open={dialogState.open}
          onClose={hideDialog}
          title={dialogState.title}
          message={dialogState.message}
          actionText={dialogState.actionText}
        />
      )}

      {/* Error Dialog */}
      {dialogState.open && dialogState.type === 'error' && (
        <ErrorDialog
          open={dialogState.open}
          onClose={hideDialog}
          title={dialogState.title}
          message={dialogState.message}
          actionText={dialogState.actionText}
        />
      )}
    </DialogContext.Provider>
  );
};

// Custom hook to use the dialog context
export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider');
  }
  return context;
};