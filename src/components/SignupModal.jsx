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
  const [otp, setOtp] = useState("112233"); // Default OTP
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    phone: false,
    password: false,
  });

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && open) {
      showSuccess(t("signup.successfulSignup"), t("signup.welcome"));
      onSuccess?.();
      handleClose();
    }
  }, [isAuthenticated, open, onSuccess, showSuccess, t]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setStep("register");
    setFormData({
      name: "",
      phone: "",
      password: "",
    });
    setOtp("112233");
    setError("");
    setFieldErrors({
      name: false,
      phone: false,
      password: false,
    });
  };

  const validateRegistrationForm = () => {
    const errors = {
      name: !formData.name || formData.name.trim().length < 2,
      phone: !formData.phone || formData.phone.length < 8,
      password: !formData.password || formData.password.length < 6,
    };

    setFieldErrors(errors);

    if (errors.name) {
      setError(t("register.nameRequired"));
    } else if (errors.phone) {
      setError(t("register.phoneRequired"));
    } else if (errors.password) {
      setError(t("register.passwordTooShort"));
    }

    return !errors.name && !errors.phone && !errors.password;
  };

  const handleApiError = (error, isRegistration = true) => {
    const status = error?.status || error?.response?.status;
    const serverMessage = error?.response?.data?.message || error?.message;
    const errorCode = error?.code || error?.response?.data?.code;
    
    let errorMessage = t("errors.default");
    const newFieldErrors = { name: false, phone: false, password: false };

    // Don't show error if this is actually a success response wrapped in an error
    const errorData = error?.response?.data || error?.data || error;
    if (errorData?.status === 'success' || errorData?.success === true || errorData?.token) {
      console.log("Skipping error handling - success found in error data");
      return;
    }

    switch (status) {
      case 400:
        if (serverMessage?.toLowerCase().includes('otp')) {
          errorMessage = t("signup.invalidOtp");
        } else {
          errorMessage = serverMessage || t("errors.badRequest");
        }
        break;
      case 409:
        if (serverMessage?.toLowerCase().includes('already exists') || 
            serverMessage?.toLowerCase().includes('already registered')) {
          errorMessage = t("register.errors.userExists");
          newFieldErrors.phone = true;
        } else {
          errorMessage = serverMessage || t("register.errors.conflict");
        }
        break;
      case 422:
        errorMessage = serverMessage || t("errors.validation");
        break;
      case 500:
        errorMessage = t("errors.server");
        break;
      default:
        if (serverMessage) {
          if (serverMessage.toLowerCase().includes('already exists') || 
              serverMessage.toLowerCase().includes('already registered')) {
            errorMessage = t("register.errors.userExists");
            newFieldErrors.phone = true;
          } else if (serverMessage.toLowerCase().includes('invalid otp') || 
                     serverMessage.toLowerCase().includes('otp')) {
            errorMessage = t("signup.invalidOtp");
          } else {
            errorMessage = serverMessage;
          }
        } else {
          // For OTP verification errors without specific message
          if (!isRegistration) {
            errorMessage = t("signup.invalidOtp");
          }
        }
    }

    console.log("Setting error message:", errorMessage);
    setError(errorMessage);
    
    if (isRegistration) {
      setFieldErrors(newFieldErrors);
    }
    
    // Only show error dialog for server errors or critical issues
    if (status >= 500 || (!status && isRegistration)) {
      showError(errorMessage);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ name: false, phone: false, password: false });

    if (!validateRegistrationForm()) return;

    // Use React Query mutation with callbacks
    registerMutation(
      {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        password: formData.password.trim(),
      },
      {
        onSuccess: (response) => {
          console.log("Registration success callback:", response);

          // Check if registration was successful
          if (response?.status === "success" || 
              response?.data?.success || 
              response?.success !== false) {
            showSuccess(t("signup.registrationSuccess"), t("signup.otpSent"));
            setStep("otp");
            setError(""); // Clear any previous errors
          } else {
            const errorMsg = response?.message || response?.data?.message || t("signup.registerError");
            setError(errorMsg);
            handleApiError({ message: errorMsg, status: 400 });
          }
        },
        onError: (error) => {
          console.error("Registration error callback:", error);
          handleApiError(error);
        }
      }
    );
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError(t("signup.invalidOtp"));
      return;
    }

    setError("");

    // Use React Query mutation with callbacks
    verifyOTP(
      {
        phone: formData.phone.trim(),
        otp: otp.trim(),
      },
      {
        onSuccess: (response) => {
          console.log("OTP verification success callback:", response);
          
          // Handle successful verification
          if (response?.status === 'success' || response?.success === true || response?.token) {
            const token = response?.token || response?.data?.token;
            
            if (token) {
              localStorage.setItem("authToken", token);
              console.log("🔐 Token stored successfully:", token.substring(0, 20) + "...");
            }
            
            showSuccess(t("signup.verificationSuccess"), t("signup.welcome"));
            
            // Small delay to ensure success message is shown before closing
            setTimeout(() => {
              onSuccess?.();
              handleClose();
            }, 500);
            
          } else {
            // Unexpected response format
            console.warn("Unexpected OTP verification response format:", response);
            const errorMsg = response?.message || response?.data?.message || t("signup.verifyOtpError");
            setError(errorMsg);
          }
        },
        onError: (error) => {
          console.error("OTP verification error callback:", error);
          
          // Check if the error actually contains success data (some APIs throw on success)
          const errorResponse = error?.response?.data || error?.data || error;
          console.log("Error response data:", errorResponse);
          
          if (errorResponse?.status === 'success' || 
              errorResponse?.success === true || 
              errorResponse?.token || 
              errorResponse?.data?.token) {
            
            console.log("Success found in error response, processing...");
            const token = errorResponse?.token || errorResponse?.data?.token;
            
            if (token) {
              localStorage.setItem("authToken", token);
              console.log("🔐 Token stored from error response:", token.substring(0, 20) + "...");
            }
            
            showSuccess(t("signup.verificationSuccess"), t("signup.welcome"));
            
            setTimeout(() => {
              onSuccess?.();
              handleClose();
            }, 500);
            
            return;
          }
          
          // Handle actual errors
          handleApiError(error, false);
        }
      }
    );
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const formatPhoneNumber = (value) => {
    return value.replace(/\D/g, "").slice(0, 15);
  };

  const handleOpenLogin = () => {
    handleClose();
    setTimeout(() => {
      onOpenLogin();
    }, 150);
  };

  const isRegistrationDisabled = registerLoading || 
    !formData.name.trim() || 
    !formData.phone.trim() || 
    !formData.password.trim();

  const isOtpDisabled = verifyOTPLoading || otp.length !== 6;

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
        <Button 
          onClick={handleClose} 
          sx={{ minWidth: "auto", p: 0 }}
          disabled={registerLoading}
        >
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
              {fieldErrors.phone && error === t("register.errors.userExists") && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t("register.alreadyHaveAccount")}
                  </Typography>
                  <Button
                    variant="text"
                    onClick={handleOpenLogin}
                    size="small"
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
                    {t("register.loginHere")}
                  </Button>
                </Box>
              )}
            </Alert>
          )}

          <TextField
            fullWidth
            name="name"
            label={t("register.name")}
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t("register.namePlaceholder")}
            disabled={registerLoading}
            InputProps={{
              startAdornment: (
                <Person sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.name}
            helperText={fieldErrors.name ? t("register.nameRequired") : ""}
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
            disabled={registerLoading}
            InputProps={{
              startAdornment: (
                <Phone sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.phone}
            helperText={fieldErrors.phone ? t("register.phoneRequired") : ""}
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
            disabled={registerLoading}
            InputProps={{
              startAdornment: (
                <Lock sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ mb: 2 }}
            error={fieldErrors.password}
            helperText={fieldErrors.password ? t("register.passwordTooShort") : ""}
            required
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("register.haveAccount")}
            </Typography>
            <Button
              variant="text"
              onClick={handleOpenLogin}
              disabled={registerLoading}
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
          <Button 
            onClick={handleClose} 
            variant="outlined"
            disabled={registerLoading}
          >
            {t("register.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isRegistrationDisabled}
            startIcon={registerLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
              minWidth: 120,
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
        <Button 
          onClick={handleClose} 
          sx={{ minWidth: "auto", p: 0 }}
          disabled={verifyOTPLoading}
        >
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
            disabled={verifyOTPLoading}
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
            required
          />

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {t("register.defaultOtpHint")} 112233
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="text"
              onClick={() => {
                setStep("register");
                setError("");
              }}
              disabled={verifyOTPLoading}
              sx={{ color: "text.secondary" }}
            >
              {t("register.changeDetails")}
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            disabled={verifyOTPLoading}
          >
            {t("register.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isOtpDisabled}
            startIcon={verifyOTPLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
              minWidth: 120,
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
      disableEscapeKeyDown={registerLoading || verifyOTPLoading}
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