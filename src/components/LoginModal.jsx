import React, { useState, useEffect, useCallback } from "react";
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
  const [localError, setLocalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    phone: false,
    password: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && open && !isSubmitting) {
      showSuccess(t("login.successfulLogin") || "Login successful", t("login.welcome") || "Welcome");
      onSuccess?.();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t, isSubmitting]);

  // Handle auth errors from context
  useEffect(() => {
    if (authError && open) {
      console.log('🔴 Auth error detected in LoginModal:', authError);
      handleApiError(authError);
      setIsSubmitting(false);
    }
  }, [authError, open]);

  const resetForm = useCallback(() => {
    setPhoneNumber("");
    setPassword("");
    setLocalError("");
    setFieldErrors({ phone: false, password: false });
    setIsSubmitting(false);
    clearAuthError();
  }, [clearAuthError]);

  const validateForm = () => {
    const errors = {
      phone: !phoneNumber || phoneNumber.length < 8,
      password: !password || password.length < 6
    };
    
    setFieldErrors(errors);
    
    if (errors.phone && errors.password) {
      setLocalError(t("login.fillAllFields") || "Please fill all fields");
    } else if (errors.phone) {
      setLocalError(t("login.invalidPhone") || "Please enter a valid phone number");
    } else if (errors.password) {
      setLocalError(t("login.passwordTooShort") || "Password must be at least 6 characters");
    } else {
      setLocalError("");
    }
    
    return !errors.phone && !errors.password;
  };
  const handleSubmit = useCallback(async (e) => {
    // CRITICAL: Always prevent default form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent?.stopImmediatePropagation?.();
      e.persist?.();
    }
    
    console.log('🔵 Form submit triggered');
    
    // Prevent multiple submissions
    if (isSubmitting || loginLoading) {
      console.log('🔴 Preventing multiple submissions');
      return;
    }
    
    // Clear previous errors
    setLocalError("");
    setFieldErrors({ phone: false, password: false });
    clearAuthError();
    
    // Validate inputs
    if (!validateForm()) {
      console.log('🔴 Form validation failed');
      return;
    }
  
    setIsSubmitting(true);
  
    console.log('🔵 Submitting login with:', { phone: phoneNumber.trim() });
  
    try {
      await login({ 
        phone: phoneNumber.trim(), 
        password: password.trim() 
      });
      
      // No need to handle success here - useEffect will handle it
    } catch (error) {
      console.error("🔴 Login error in handleSubmit:", error);
      setIsSubmitting(false);
      // Error will be handled by the authError useEffect
    }
  }, [phoneNumber, password, login, loginLoading, isSubmitting, clearAuthError, validateForm]);
  const handleApiError = (error) => {
    const status = error?.status || error?.response?.status;
    const errorCode = error?.code || error?.response?.data?.code;
    const serverMessage = error?.response?.data?.message || error?.message;
    
    console.log("Handling API error:", { status, errorCode, serverMessage, error });
    
    let errorMessage = t("errors.default") || "An error occurred";
    const newFieldErrors = { phone: false, password: false };
  
    // Handle specific error cases
    switch (status) {
      case 400:
        errorMessage = serverMessage || t("errors.badRequest") || "Bad request";
        break;
        
      case 401:
        // Invalid credentials - wrong password for existing user
        errorMessage = t("login.errors.credentials") || "Invalid phone number or password";
        newFieldErrors.password = true;
        break;
        
      case 404:
        // User not found - phone number not registered
        errorMessage = t("login.errors.notFound") || "Phone number not registered";
        newFieldErrors.phone = true;
        break;
        
      case 409:
        errorMessage = t("login.errors.userExists") || "User already exists";
        newFieldErrors.phone = true;
        break;
        
      case 422:
        errorMessage = serverMessage || t("errors.validation") || "Invalid input data";
        break;
        
      case 500:
      case 502:
      case 503:
        errorMessage = t("errors.server") || "Server error occurred";
        break;
        
      default:
        // Handle based on server message content if no specific status
        if (serverMessage) {
          const lowerMessage = serverMessage.toLowerCase();
          
          if (lowerMessage.includes('user not found') || 
              lowerMessage.includes('phone not found') ||
              lowerMessage.includes('not registered') ||
              lowerMessage.includes('does not exist')) {
            errorMessage = t("login.errors.notFound") || "Phone number not registered";
            newFieldErrors.phone = true;
          } else if (lowerMessage.includes('invalid password') || 
                     lowerMessage.includes('wrong password') ||
                     lowerMessage.includes('invalid credentials') || 
                     lowerMessage.includes('incorrect password')) {
            errorMessage = t("login.errors.credentials") || "Invalid phone number or password";
            newFieldErrors.password = true;
          } else if (lowerMessage.includes('already exists')) {
            errorMessage = t("login.errors.userExists") || "User already exists";
            newFieldErrors.phone = true;
          } else {
            errorMessage = serverMessage;
          }
        }
    }
  
    setLocalError(errorMessage);
    setFieldErrors(newFieldErrors);
    
    // Only show error dialog for server errors (500+)
    if (status >= 500) {
      showError(errorMessage);
    }
  };

  const handleClose = useCallback(() => {
    if (isSubmitting || loginLoading) {
      return; // Prevent closing while submitting
    }
    resetForm();
    onClose();
  }, [isSubmitting, loginLoading, resetForm, onClose]);

  const handleRegisterClick = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleClose();
    // Small timeout to ensure modal close animation completes
    setTimeout(() => {
      onOpenSignup?.();
    }, 150);
  }, [handleClose, onOpenSignup]);

  const formatPhoneNumber = (value) => {
    // Remove all non-digits and limit to reasonable phone number length
    return value.replace(/\D/g, "").slice(0, 15);
  };

  const currentError = localError || (authError?.message);
  console.log("currentError", currentError);
  const showUserNotFoundRegister = fieldErrors.phone && (
    currentError === (t("login.errors.notFound") || "Phone number not registered") ||
    currentError?.toLowerCase().includes('not found') ||
    currentError?.toLowerCase().includes('not registered')
  );

  

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isSubmitting || loginLoading}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
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
          {t("login.title") || "Login"}
        </Typography>
        <Button 
          onClick={handleClose} 
          sx={{ minWidth: "auto", p: 0 }}
          disabled={isSubmitting || loginLoading}
        >
          <Close />
        </Button>
      </DialogTitle>
      
      <Box 
  component="form" 
  onSubmit={handleSubmit} 
  noValidate
  sx={{ width: '100%' }}
  
>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("login.description") || "Please enter your phone number and password to login"}
          </Typography>

          {currentError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {currentError}
              {showUserNotFoundRegister && (
                <Box sx={{ mt: 1 }}>
                  {/* <Typography variant="body2" sx={{ mb: 1 }}>
                    {t("login.dontHaveAccount") || "Don't have an account?"} {t("login.registerHere") || "Register here"}
                  </Typography> */}
                  {/* <Button
                    variant="text"
                    onClick={handleRegisterClick}
                    size="small"
                    type="button"
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
                    {t("login.registerHere") || "Register here"}
                  </Button> */}
                </Box>
              )}
            </Alert>
          )}

          <TextField
            fullWidth
            label={t("login.phoneNumber") || "Phone Number"}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            placeholder={t("login.phonePlaceholder") || "Enter your phone number"}
            type="tel"
            disabled={isSubmitting || loginLoading}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.phone}
            helperText={fieldErrors.phone ? (t("login.invalidPhone") || "Invalid phone number") : ""}
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }
            }}
          />

          <TextField
            fullWidth
            label={t("login.password") || "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.passwordPlaceholder") || "Enter your password"}
            disabled={isSubmitting || loginLoading}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.password}
            helperText={fieldErrors.password ? (t("login.invalidCredentials") || "Invalid credentials") : ""}
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("login.noAccount") || "Don't have an account?"}
            </Typography>
            <Button
              variant="text"
              onClick={handleRegisterClick}
              disabled={isSubmitting || loginLoading}
              type="button"
              sx={{
                color: "#2e7d32",
                textTransform: 'none',
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: 'transparent'
                },
              }}
            >
              {t("login.registerHere") || "Register here"}
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            disabled={isSubmitting || loginLoading}
            type="button"
          >
            {t("login.cancel") || "Cancel"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || loginLoading || !phoneNumber || !password}
            startIcon={(isSubmitting || loginLoading) ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
              minWidth: 120,
            }}
          >
            {(isSubmitting || loginLoading) ? (t("login.loggingIn") || "Logging in...") : (t("login.login") || "Login")}
          </Button>
        </DialogActions>
      </Box>

    </Dialog>
  );
};

export default LoginModal;