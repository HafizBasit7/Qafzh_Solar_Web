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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, ArrowBack, CameraAlt } from "@mui/icons-material";
import { useAuthContext } from "../contexts/AuthContext";
import { useDialogContext } from "../contexts/DialogContext";
import { uploadAPI } from "../utils/imageUpload";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, updateProfile, isUpdating } = useAuthContext();
  const { showToast } = useDialogContext();
  const [formData, setFormData] = useState({
    name: "",
    profileImageUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        profileImageUrl: user.profileImageUrl || "",
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: imageUrl,
      }));
      showToast("success", t("profile.imageUpdated"));
    } catch (error) {
      showToast("error", t("profile.imageUploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("error", t("profile.nameRequired"));
      return;
    }

    try {
      await updateProfile(formData);
      showToast("success", t("profile.updateSuccess"));
      navigate(-1);
    } catch (error) {
      showToast("error", error.message || t("profile.updateError"));
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        pb: 4,
      }}
    >
      {/* Header */}
      <Box
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
        <IconButton onClick={() => navigate(-1)} sx={{ color: "#22C55E" }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            ml: 1,
            fontWeight: "bold",
            flexGrow: 1,
            color: "#32325d",
            fontSize: isMobile ? "1.1rem" : "1.25rem",
          }}
        >
          {t("profile.updateProfile")}
        </Typography>
        <Button
          onClick={handleSubmit}
          disabled={isUpdating}
          sx={{
            color: "#22C55E",
            fontWeight: "medium",
            fontSize: isMobile ? "0.875rem" : "1rem",
            minWidth: "auto",
          }}
        >
          {isUpdating ? (
            <CircularProgress size={24} sx={{ color: "#22C55E" }} />
          ) : (
            t("PROFILE.SAVE")
          )}
        </Button>
      </Box>

      {/* Profile Picture */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          mb: 3,
          px: 2,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={formData.profileImageUrl}
            sx={{
              width: 120,
              height: 120,
              fontSize: 48,
              border: "3px solid #f0f2f5",
            }}
          >
            {!formData.profileImageUrl && (user?.name?.[0] || "U")}
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
                bottom: 0,
                right: 0,
                backgroundColor: "#22C55E",
                color: "white",
                "&:hover": { backgroundColor: "#1a9c4a" },
                width: 40,
                height: 40,
              }}
              disabled={isUploading}
            >
              {isUploading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <CameraAlt fontSize={isMobile ? "small" : "medium"} />
              )}
            </IconButton>
          </label>
        </Box>
      </Box>

      {/* Form */}
      <Box
        sx={{
          backgroundColor: "white",
          mx: isMobile ? 2 : 4,
          borderRadius: 2,
          p: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          fullWidth
          label={t("profile.name")}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
          }}
        />

        <TextField
          fullWidth
          label={t("profile.phone")}
          value={user?.phone || ""}
          margin="normal"
          disabled
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
            "& .MuiInputBase-input": {
              color: "#a0aec0",
            },
          }}
        />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: "#a0aec0",
            fontSize: "0.75rem",
          }}
        >
          {t("profile.phoneChangeDisabled")}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isUpdating}
          sx={{
            backgroundColor: "#22C55E",
            "&:hover": { backgroundColor: "#1a9c4a" },
            py: 1.5,
            borderRadius: 1,
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          {isUpdating ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            t("profile.saveChanges")
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProfile;