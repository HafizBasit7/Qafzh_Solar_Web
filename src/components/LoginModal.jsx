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
  Link,
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
    loginError,
    isAuthenticated 
  } = useAuthContext();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setPassword("");
      setError("");
    }
  }, [open]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && open) {
      showSuccess(t("login.successfulLogin"), t("login.welcome"));
      onSuccess();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setError(t("login.invalidPhone"));
      return;
    }
    if (!password) {
      setError(t("login.passwordRequired"));
      return;
    }

    setError("");

    try {
      await login({ phone: phoneNumber, password });
      // If successful, useEffect will handle the rest
    } catch (err) {
      if (err?.response?.status === 404) {
        setError(t("login.userNotFound"));
      } else if (err?.response?.status === 401) {
        setError(t("login.invalidCredentials"));
      } else {
        setError(err.message || t("login.loginError"));
      }
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleRegisterClick = () => {
    onClose();
    onOpenSignup();
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
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("login.noAccount")}
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={handleRegisterClick}
              sx={{
                color: "#2e7d32",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("login.registerHere")}
            </Link>
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