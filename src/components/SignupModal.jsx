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
import { Close, Phone, Lock, Person, LockReset } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import { useDialogContext } from "../contexts/DialogContext";

const SignupModal = ({ open, onClose, onSuccess, onOpenLogin }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useDialogContext();

  const {
    register: registerMutation,
    registerLoading,
    verifyOTP,
    verifyOTPLoading,
    isAuthenticated,
  } = useAuth();

  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [otp, setOtp] = useState("112233"); // Default OTP set to 112233
  const [error, setError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  useEffect(() => {
    if (isAuthenticated && open) {
      showSuccess(t("signup.successfulSignup"), t("signup.welcome"));
      onSuccess?.();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t]);

  // const handleRegisterSubmit = (e) => {
  //   e.preventDefault();
  //   setError("");

  //   registerMutation(
  //     {
  //       name: formData.name,
  //       phone: formData.phone,  // Changed from phoneNumber to phone
  //       password: formData.password,
  //     },
  //     {
  //       onSuccess: (res) => {
  //         if (res?.status === "fail") {
  //           setError(res.message || t("signup.registerError"));
  //           return;
  //         }
  //         // Show success message for registration
  //         showSuccess(t("signup.registrationSuccess"), t("signup.otpSent"));
  //         setStep("otp");
  //       },
  //       onError: (err) => {
  //           console.log("msg",err);
  //         setError(err.message);
  //       },
  //     }
  //   );
  // };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await registerMutation({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      });
  
      console.log("Registration response:", response);
  
      // Check if registration was successful
      if (response?.status === "success" || response?.data?.success) {
        showSuccess(t("signup.registrationSuccess"), t("signup.otpSent"));
        setStep("otp"); // Move to OTP step
      } else {
        setError(response?.message || t("signup.registerError"));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err?.response?.data?.message || err.message || t("signup.registerError"));
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
      const res = await verifyOTP({
        phone: formData.phone,
        otp,
      });

      if (res?.token) {
        localStorage.setItem("authToken", res.token);
        showSuccess(t("signup.verificationSuccess"), t("signup.welcome"));
        onSuccess?.();
        handleClose();
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || t("signup.verifyOtpError");
      showError(message);
      setError(message);
    }
  };

  const handleClose = () => {
    setStep("register");
    setFormData({
      name: "",
      phone: "",
      password: "",
    });
    setOtp("112233"); // Reset to default OTP
    setError("");
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleOpenLogin = () => {
    handleClose();
    onOpenLogin();
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
            required
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
            required
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
            required
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("register.haveAccount")}
            </Typography>
            <Button
              variant="text"
              onClick={handleOpenLogin}
              sx={{
                color: "#2e7d32",
                textTransform: "none",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              {t("register.loginHere")}
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
            disabled={
              registerLoading ||
              !formData.name ||
              !formData.phone ||
              !formData.password
            }
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
              startAdornment: (
                <LockReset sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            {t("register.defaultOtpHint")} 112233
          </Typography>

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