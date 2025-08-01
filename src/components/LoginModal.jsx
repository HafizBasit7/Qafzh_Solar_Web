import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close, Phone, Lock } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../contexts/AuthContext";
import { useDialogContext } from "../contexts/DialogContext";

const LoginModal = ({ open, onClose, onSuccess, onOpenSignup }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useDialogContext();
  const { 
    login, 
    loginLoading, 
    isAuthenticated,
    authError,
    clearAuthError
  } = useAuthContext();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    phone: false,
    password: false
  });

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setPassword("");
      setError("");
      setFieldErrors({ phone: false, password: false });
      clearAuthError();
    }
  }, [open, clearAuthError]);

  // Handle authentication status changes
  useEffect(() => {
    if (isAuthenticated && open) {
      showSuccess(t("login.successfulLogin"), t("login.welcome"));
      onSuccess();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t]);

  // Handle auth errors from context
  useEffect(() => {
    if (authError && open) {
      handleApiError(authError);
    }
  }, [authError, open]);

  const validateForm = () => {
    const validationErrors = {
      phone: !phoneNumber || phoneNumber.length < 8,
      password: !password
    };
    
    if (validationErrors.phone || validationErrors.password) {
      setFieldErrors(validationErrors);
      setError(t("login.fillAllFields"));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setFieldErrors({ phone: false, password: false });
    clearAuthError();

    // Validate inputs
    if (!validateForm()) return;

    try {
      const response = await login({ phone: phoneNumber, password });
      
      // Only show success if login was actually successful
      if (response?.success) {
        showSuccess(t("login.successfulLogin"), t("login.welcome"));
        onSuccess();
        handleClose();
      }
    } catch (error) {
      // Errors are handled through authError in context
      console.error("Login error:", error);
    }
  };
  
  const handleApiError = (error) => {
    const status = error?.status || error?.response?.status;
    const errorCode = error?.code || error?.response?.data?.code;
    let errorMessage = t("errors.default");
    const newFieldErrors = { phone: false, password: false };
  
    switch (status) {
      case 400:
        errorMessage = t("errors.badRequest");
        break;
      case 401:
        if (errorCode === 'INVALID_CREDENTIALS') {
          errorMessage = t("login.errors.credentials");
          newFieldErrors.password = true;
        } else {
          errorMessage = t("login.errors.unauthorized");
        }
        break;
      case 404:
        if (errorCode === 'USER_NOT_FOUND') {
          errorMessage = t("login.errors.notFound");
          newFieldErrors.phone = true;
        } else {
          errorMessage = t("errors.notFound");
        }
        break;
      case 422:
        errorMessage = t("errors.validation");
        break;
      case 500:
        errorMessage = t("errors.server");
        break;
      default:
        if (error?.message) {
          errorMessage = error.message;
        }
    }
  
    setError(errorMessage);
    setFieldErrors(newFieldErrors);
    showError(errorMessage);
  };

  const handleClose = () => {
    setPhoneNumber("");
    setPassword("");
    setError("");
    setFieldErrors({ phone: false, password: false });
    clearAuthError();
    onClose();
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    handleClose();
    // Small timeout to ensure modal close animation completes
    setTimeout(() => {
      onOpenSignup();
    }, 200);
  };
  

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {t("login.title")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
          <Close />
        </Button>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("login.description")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              {(error === t("login.errors.notFound") || error === t("login.errors.credentials")) && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="text"
                    onClick={handleRegisterClick}
                    sx={{
                      color: "inherit",
                      textDecoration: "underline",
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      "&:hover": {
                        textDecoration: "none",
                        backgroundColor: 'transparent'
                      },
                    }}
                  >
                    {t("login.registerHere")}
                  </Button>
                </Box>
              )}
            </Alert>
          )}

          <TextField
            fullWidth
            label={t("login.phoneNumber")}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            placeholder={t("login.phonePlaceholder")}
            type="tel"
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.phone}
            helperText={fieldErrors.phone ? t("login.invalidPhone") : ""}
          />

          <TextField
            fullWidth
            label={t("login.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.passwordPlaceholder")}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.password}
            helperText={fieldErrors.password ? t("login.invalidCredentials") : ""}
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("login.noAccount")}
            </Typography>
            <Button
              variant="text"
              onClick={handleRegisterClick}
              sx={{
                color: "#2e7d32",
                textTransform: 'none',
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: 'transparent'
                },
              }}
            >
              {t("login.registerHere")}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} variant="outlined">
            {t("login.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loginLoading}
            startIcon={loginLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {loginLoading ? t("login.loggingIn") : t("login.login")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal;