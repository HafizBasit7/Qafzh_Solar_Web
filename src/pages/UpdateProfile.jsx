import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Paper,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, ArrowBack, CameraAlt, Person, Phone as PhoneIcon } from "@mui/icons-material";
import { useAuthContext } from "../contexts/AuthContext";
import { useDialogContext } from "../contexts/DialogContext";
import { uploadAPI } from "../utils/imageUpload";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Fixed: Use userData instead of user to match your useAuth hook
  const { userData: user, updateProfile, isUpdating } = useAuthContext();
  const { showToast, showSuccess, showError } = useDialogContext();
  
  const [formData, setFormData] = useState({
    name: "",
    profileImageUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || user.fullName || user.username || "",
        profileImageUrl: user.profileImageUrl || user.profileImage || "",
      };
      setFormData(initialData);
    }
  }, [user]);

  // Track changes to enable/disable save button
  useEffect(() => {
    if (user) {
      const hasNameChanged = formData.name !== (user.name || user.fullName || user.username || "");
      const hasImageChanged = formData.profileImageUrl !== (user.profileImageUrl || user.profileImage || "");
      setHasChanges(hasNameChanged || hasImageChanged);
    }
  }, [formData, user]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("profile.nameRequired") || "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("profile.nameMinLength") || "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t("profile.nameMaxLength") || "Name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload with better error handling
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      showError(t("profile.invalidFileType") || "Please select a valid image file");
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      showError(t("profile.fileSizeLimit") || "Image size must be less than 5MB");
      return;
    }
  
    try {
      setIsUploading(true);
      const response = await uploadAPI.uploadImage(file);
      // Extract the URL from the response correctly
      const imageUrl = response.fileUrl || response.url || response.imageUrl;
      
      if (!imageUrl) {
        throw new Error("No valid image URL returned from server");
      }
  
      setFormData(prev => ({
        ...prev,
        profileImageUrl: imageUrl,
      }));
      showSuccess(t("profile.imageUpdated") || "Profile image updated successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      showError(
        error.message || 
        t("profile.imageUploadError") || 
        "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      showToast("info", t("profile.noChanges") || "No changes to save");
      return;
    }

    try {
      const updateData = {
        name: formData.name.trim(),
        ...(formData.profileImageUrl && { profileImageUrl: formData.profileImageUrl }),
      };

      await updateProfile(updateData);
      showSuccess(
        t("profile.updateSuccess") || "Profile updated successfully",
        t("profile.updateSuccessDesc") || "Your profile information has been updated"
      );
      navigate(-1);
    } catch (error) {
      console.error("Profile update error:", error);
      showError(
        error.message || 
        t("profile.updateError") || 
        "Failed to update profile. Please try again."
      );
    }
  };

  // Handle name change with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    
    // Clear error when user starts typing
    if (errors.name && value.trim()) {
      setErrors({ ...errors, name: null });
    }
  };

  // Loading state while user data is being fetched
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#22C55E" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        pb: 4,
      }}
    >
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: "white",
          borderBottom: "1px solid #e9ecef",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            color: "#22C55E",
            mr: 1,
            "&:hover": {
              backgroundColor: "rgba(34, 197, 94, 0.04)"
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            flexGrow: 1,
            color: "#1a202c",
            fontSize: isMobile ? "1.1rem" : "1.25rem",
          }}
        >
          {t("profile.updateProfile") || "Update Profile"}
        </Typography>
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || !hasChanges}
          variant={hasChanges ? "contained" : "outlined"}
          sx={{
            backgroundColor: hasChanges ? "#22C55E" : "transparent",
            color: hasChanges ? "white" : "#22C55E",
            borderColor: "#22C55E",
            fontWeight: "600",
            fontSize: isMobile ? "0.875rem" : "1rem",
            minWidth: "80px",
            "&:hover": {
              backgroundColor: hasChanges ? "#1a9c4a" : "rgba(34, 197, 94, 0.04)",
            },
            "&:disabled": {
              backgroundColor: "#f1f5f9",
              color: "#94a3b8",
              borderColor: "#e2e8f0"
            }
          }}
        >
          {isUpdating ? (
            <CircularProgress size={20} sx={{ color: "inherit" }} />
          ) : (
            t("common.save") || "Save"
          )}
        </Button>
      </Paper>

      <Fade in timeout={300}>
        <Box>
          {/* Enhanced Profile Picture Section */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 3,
              mb: 3,
              mx: isMobile ? 2 : 4,
              py: 4,
              px: 2,
              borderRadius: 3,
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "#374151",
                fontWeight: "600",
                textAlign: "center"
              }}
            >
              {t("profile.profilePicture") || "Profile Picture"}
            </Typography>

            <Box sx={{ position: "relative", mb: 2 }}>
              <Avatar
                src={formData.profileImageUrl}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  fontWeight: "600",
                  border: "4px solid #f0f2f5",
                  backgroundColor: "#22C55E",
                  color: "white",
                }}
              >
                {!formData.profileImageUrl && 
                  (formData.name ? 
                    formData.name.charAt(0).toUpperCase() : 
                    (user?.phone || user?.phoneNumber || "U").slice(-1)
                  )
                }
              </Avatar>
              <label htmlFor="profile-image-upload">
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    backgroundColor: "#22C55E",
                    color: "white",
                    "&:hover": { 
                      backgroundColor: "#1a9c4a",
                      transform: "scale(1.05)"
                    },
                    width: 44,
                    height: 44,
                    boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <CameraAlt fontSize="small" />
                  )}
                </IconButton>
              </label>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: "#6b7280",
                textAlign: "center",
                maxWidth: 280,
                lineHeight: 1.4
              }}
            >
              {t("profile.imageUploadHint") || "Click the camera icon to update your profile picture"}
            </Typography>
          </Paper>

          {/* Enhanced Form */}
          <Paper
            elevation={0}
            sx={{
              mx: isMobile ? 2 : 4,
              borderRadius: 3,
              p: 4,
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "#374151",
                fontWeight: "600"
              }}
            >
              {t("profile.personalInfo") || "Personal Information"}
            </Typography>

            <TextField
              fullWidth
              label={t("profile.name") || "Full Name"}
              value={formData.name}
              onChange={handleNameChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <Person sx={{ color: "#9ca3af", mr: 1, fontSize: 20 }} />
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#22C55E",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#22C55E",
                  }
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#22C55E",
                }
              }}
            />

            <TextField
              fullWidth
              label={t("profile.phone") || "Phone Number"}
              value={user?.phone || user?.phoneNumber || user?.mobile || ""}
              margin="normal"
              disabled
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ color: "#9ca3af", mr: 1, fontSize: 20 }} />
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#f8fafc"
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "#64748b",
                  "-webkit-text-fill-color": "#64748b",
                },
              }}
            />

            <Alert 
              severity="info" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
                backgroundColor: "#f0f9ff",
                border: "1px solid #e0f2fe",
                "& .MuiAlert-icon": {
                  color: "#0284c7"
                }
              }}
            >
              <Typography variant="caption" sx={{ color: "#0369a1" }}>
                {t("profile.phoneChangeDisabled") || "Phone number cannot be changed for security reasons"}
              </Typography>
            </Alert>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              disabled={isUpdating || !hasChanges}
              sx={{
                backgroundColor: "#22C55E",
                "&:hover": { 
                  backgroundColor: "#1a9c4a",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                },
                "&:disabled": {
                  backgroundColor: "#f1f5f9",
                  color: "#94a3b8"
                },
                py: 1.8,
                borderRadius: 2,
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontWeight: "600",
                transition: "all 0.2s ease",
                boxShadow: hasChanges ? "0 2px 8px rgba(34, 197, 94, 0.2)" : "none"
              }}
            >
              {isUpdating ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <Typography>{t("common.saving") || "Saving..."}</Typography>
                </Box>
              ) : hasChanges ? (
                t("profile.saveChanges") || "Save Changes"
              ) : (
                t("profile.noChangesToSave") || "No Changes to Save"
              )}
            </Button>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default UpdateProfile;