import React, { useState } from "react";
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

const LoginModal = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState("phone"); // "phone", "otp", "success"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setError(t("login.invalidPhone"));
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call to send OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
      setStep("otp");
      setLoading(false);
    } catch (err) {
      setError(t("login.sendOtpError"));
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      setError(t("login.invalidOtp"));
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call to verify OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      // For demo purposes, accept any 4-digit OTP
      if (otp.length === 4) {
        setStep("success");
        setLoading(false);

        // Auto close success modal after 3 seconds
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 3000);
      } else {
        setError(t("login.invalidOtp"));
        setLoading(false);
      }
    } catch (err) {
      setError(t("login.verifyOtpError"));
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setError("");
    setLoading(false);
    onClose();
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
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} variant="outlined">
            {t("login.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !phoneNumber}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {loading ? t("login.sending") : t("login.sendOtp")}
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
            disabled={loading || otp.length !== 4}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {loading ? t("login.verifying") : t("login.verifyOtp")}
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
