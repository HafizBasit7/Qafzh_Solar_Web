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
    requestOTP, 
    requestOTPLoading, 
    requestOTPError,
    verifyOTP, 
    verifyOTPLoading, 
    verifyOTPError,
    isAuthenticated 
  } = useAuthContext();
  
  const [step, setStep] = useState("phone"); // "phone", "otp", "success"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // If user becomes authenticated, close modal and trigger success
  useEffect(() => {
    if (isAuthenticated && open) {
      showSuccess(t("login.successfulLogin"), t("login.welcome"));
      onSuccess();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setError(t("login.invalidPhone"));
      return;
    }

    setError("");

    try {
      await requestOTP(phoneNumber);
      setStep("otp");
    } catch (err) {
      setError(err.message || t("login.sendOtpError"));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      setError(t("login.invalidOtp"));
      return;
    }

    setError("");

    try {
      await verifyOTP({ phone: phoneNumber, otp });
      // If verification is successful, the useEffect will handle the success
    } catch (err) {
      setError(err.message || t("login.verifyOtpError"));
    }
  };

  const handleClose = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleRegisterClick = () => {
    onClose(); // Close login modal
    onOpenSignup(); // Open signup modal
  };

  const renderPhoneStep = () => (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {t("login.enterPhone")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
          <Close />
        </Button>
      </DialogTitle>
      <form onSubmit={handlePhoneSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("login.phoneDescription")}
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
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t("login.phonePlaceholder")}
            type="tel"
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />,
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
            disabled={requestOTPLoading || !phoneNumber}
            startIcon={requestOTPLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {requestOTPLoading ? t("login.sending") : t("login.sendOtp")}
          </Button>
        </DialogActions>
      </form>
    </>
  );

  const renderOtpStep = () => (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {t("login.enterOtp")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
          <Close />
        </Button>
      </DialogTitle>
      <form onSubmit={handleOtpSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("login.otpDescription", { phone: phoneNumber })}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label={t("login.otp")}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="1234"
            type="text"
            inputProps={{
              maxLength: 4,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                letterSpacing: "0.5rem",
              },
            }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setStep("phone")}
              sx={{ color: "text.secondary" }}
            >
              {t("login.changePhone")}
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
            disabled={verifyOTPLoading || otp.length !== 4}
            startIcon={verifyOTPLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {verifyOTPLoading ? t("login.verifying") : t("login.verifyOtp")}
          </Button>
        </DialogActions>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
          {t("login.success")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
          <Close />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="h4" sx={{ color: "#2e7d32", mb: 2 }}>
            ✅
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("login.productListed")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("login.successDescription")}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#2e7d32",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
        >
          {t("login.continue")}
        </Button>
      </DialogActions>
    </>
  );

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
      {step === "phone" && renderPhoneStep()}
      {step === "otp" && renderOtpStep()}
      {step === "success" && renderSuccessStep()}
    </Dialog>
  );
};

export default LoginModal;
