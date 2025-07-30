import { useState, useCallback } from 'react';

const useDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: null, // 'success' or 'error'
    title: '',
    message: '',
    actionText: '',
    autoClose: false,
  });

  const showDialog = useCallback((type, title, message, actionText = null, autoClose = false) => {
    setDialogState({
      open: true,
      type,
      title,
      message,
      actionText,
      autoClose,
    });

    // Auto close dialog after 3 seconds if autoClose is true
    if (autoClose) {
      setTimeout(() => {
        hideDialog();
      }, 3000);
    }
  }, []);

  const hideDialog = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const showSuccess = useCallback((message, title = 'نجاح', actionText = 'حسناً', autoClose = false) => {
    showDialog('success', title, message, actionText, autoClose);
  }, [showDialog]);

  const showError = useCallback((message, title = 'خطأ', actionText = 'حسناً', autoClose = false) => {
    showDialog('error', title, message, actionText, autoClose);
  }, [showDialog]);

  return {
    dialogState,
    showDialog,
    hideDialog,
    showSuccess,
    showError,
  };
};

export default useDialog;