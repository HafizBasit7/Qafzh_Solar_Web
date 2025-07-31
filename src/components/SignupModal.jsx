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
import { Close, Phone, Lock, PersonAdd, Person, LockReset } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import  useAuth  from "../hooks/useAuth"; 
import { useDialogContext } from "../contexts/DialogContext";

const SignupModal = ({ open, onClose, onSuccess, onOpenLogin }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useDialogContext();
  const { 
    register, 
    registerLoading, 
    registerError, 
    verifyOTP, 
    verifyOTPLoading, 
    verifyOTPError,
    isAuthenticated 
  } = useAuth();
  
  const [step, setStep] = useState("register"); // "register", "otp", "success"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  
  // If user becomes authenticated, close modal and trigger success
  useEffect(() => {
    if (isAuthenticated && open) {
      showSuccess(t("signup.successfulSignup"), t("signup.welcome"));
      onSuccess();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      setError(t("signup.fillAllFields"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("signup.passwordLength"));
      return;
    }

    setError("");

    try {
      await register(formData);
      setStep("otp");
    } catch (err) {
      setError(err.message || t("signup.registrationError"));
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError(t("signup.invalidOtp"));
      return;
    }

    setError("");

    try {
      await verifyOTP({ phone: formData.phone, otp });
      // If verification is successful, the useEffect will handle the success
    } catch (err) {
      setError(err.message || t("signup.verifyOtpError"));
    }
  };

  const handleClose = () => {
    setStep("register");
    setFormData({
      name: "",
      phone: "",
      password: ""
    });
    setOtp("");
    setError("");
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderRegisterStep = () => (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {t("register.createAccount")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
          <Close />
        </Button>
      </DialogTitle>
      <form onSubmit={handleRegisterSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("register.registerDescription")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            name="name"
            label={t("register.name")}
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t("register.namePlaceholder")}
            InputProps={{
              startAdornment: (
                <Person sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="phone"
            label={t("register.phoneNumber")}
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t("register.phonePlaceholder")}
            type="tel"
            InputProps={{
              startAdornment: (
                <Phone sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="password"
            label={t("register.password")}
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            placeholder={t("register.passwordPlaceholder")}
            InputProps={{
              startAdornment: (
                <Lock sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("register.alreadyHaveAccount")}{" "}
              <Link
                component="button"
                type="button"
                onClick={onOpenLogin}
                sx={{ fontWeight: "bold" }}
              >
                {t("register.login")}
              </Link>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} variant="outlined">
            {t("register.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={registerLoading || !formData.name || !formData.phone || !formData.password}
            startIcon={registerLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {registerLoading ? t("signup.registering") : t("signup.register")}
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
          {t("register.enterOtp")}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
          <Close />
        </Button>
      </DialogTitle>
      <form onSubmit={handleOtpSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("register.otpDescription", { phone: formData.phone })}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label={t("register.otp")}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="112233"
            type="text"
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                letterSpacing: "0.5rem",
              },
            }}
            InputProps={{
              startAdornment: <LockReset sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setStep("register")}
              sx={{ color: "text.secondary" }}
            >
              {t("register.changeDetails")}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} variant="outlined">
            {t("register.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={verifyOTPLoading || otp.length !== 6}
            startIcon={verifyOTPLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {verifyOTPLoading ? t("signup.verifying") : t("signup.verifyOtp")}
          </Button>
        </DialogActions>
      </form>
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
      {step === "register" && renderRegisterStep()}
      {step === "otp" && renderOtpStep()}
    </Dialog>
  );
};

export default SignupModal;