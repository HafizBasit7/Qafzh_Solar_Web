import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  Close,
  AddPhotoAlternate,
  CameraAlt,
  Delete,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const SellingForm = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    productType: "",
    productCondition: "",
    brand: "",
    price: "",
    currency: "YER",
    phoneNumber: "",
    governorate: "",
    city: "",
    description: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  // Yemeni governorates
  const governorates = [
    "Sana'a",
    "Aden",
    "Taiz",
    "Al Hudaydah",
    "Ibb",
    "Dhamar",
    "Al Mahwit",
    "Raymah",
    "Al Jawf",
    "Marib",
    "Al Bayda",
    "Shabwah",
    "Hadramaut",
    "Al Mahrah",
    "Sa'dah",
    "Hajjah",
    "Amran",
    "Lahij",
    "Abyan",
    "Al Dhale'e",
  ];

  // Common solar product brands
  const commonBrands = [
    "SMA",
    "Fronius",
    "Sungrow",
    "Growatt",
    "Solis",
    "Victron Energy",
    "Schneider Electric",
    "ABB",
    "Delta",
    "Kaco",
    "Canadian Solar",
    "Jinko Solar",
    "Trina Solar",
    "Longi",
    "JA Solar",
    "Hanwha Q-Cells",
    "LG Solar",
    "Panasonic",
    "SunPower",
    "First Solar",
    "Other",
  ];

  const productTypes = [
    "Inverter",
    "Panel",
    "Battery",
    "Cables",
    "Controller",
    "Full Kit",
    "Others",
  ];

  const productConditions = ["New", "Used", "Needs Repair"];

  const currencies = [
    { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "USD", symbol: "$", name: "US Dollar" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handlePriceChange = (value) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, "");
    handleInputChange("price", numericValue);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length + imageFiles.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const handleCameraCapture = () => {
    // This would typically use a camera API
    // For now, we'll simulate by opening file input
    document.getElementById("camera-input").click();
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productType) {
      newErrors.productType = "Product type is required";
    }
    if (!formData.productCondition) {
      newErrors.productCondition = "Product condition is required";
    }
    if (!formData.brand) {
      newErrors.brand = "Brand is required";
    }
    if (!formData.price) {
      newErrors.price = "Price is required";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{8,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    if (!formData.governorate) {
      newErrors.governorate = "Governorate is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Form data:", formData);
      console.log("Image files:", imageFiles);

      // Close the selling form and open the login modal
      onClose();
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // Reset form data after successful login and product listing
    setFormData({
      productType: "",
      productCondition: "",
      brand: "",
      price: "",
      currency: "YER",
      phoneNumber: "",
      governorate: "",
      city: "",
      description: "",
      images: [],
    });
    setErrors({});
    setImageFiles([]);
  };

  const handleSignupSuccess = () => {
    // After successful signup, open login modal
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleOpenSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const handleClose = () => {
    setFormData({
      productType: "",
      productCondition: "",
      brand: "",
      price: "",
      currency: "YER",
      phoneNumber: "",
      governorate: "",
      city: "",
      description: "",
      images: [],
    });
    setErrors({});
    setImageFiles([]);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            pb: 2,
          }}
        >
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            {t("selling.title")}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Product Type */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.productType}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{t("selling.productType")}</InputLabel>
                  <Select
                    value={formData.productType}
                    onChange={(e) =>
                      handleInputChange("productType", e.target.value)
                    }
                    label={t("selling.productType")}
                  >
                    {productTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.productType && (
                    <Typography color="error" variant="caption">
                      {errors.productType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Product Condition */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.productCondition}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{t("selling.productCondition")}</InputLabel>
                  <Select
                    value={formData.productCondition}
                    onChange={(e) =>
                      handleInputChange("productCondition", e.target.value)
                    }
                    label={t("selling.productCondition")}
                  >
                    {productConditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.productCondition && (
                    <Typography color="error" variant="caption">
                      {errors.productCondition}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Brand */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.brand}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{t("selling.brand")}</InputLabel>
                  <Select
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    label={t("selling.brand")}
                  >
                    {commonBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.brand && (
                    <Typography color="error" variant="caption">
                      {errors.brand}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Price and Currency */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                  <TextField
                    sx={{ flex: 1 }}
                    label={t("selling.price")}
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {
                            currencies.find((c) => c.code === formData.currency)
                              ?.symbol
                          }
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel>{t("selling.currency")}</InputLabel>
                    <Select
                      value={formData.currency}
                      onChange={(e) =>
                        handleInputChange("currency", e.target.value)
                      }
                      label={t("selling.currency")}
                    >
                      {currencies.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("selling.phoneNumber")}
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber || t("selling.required")}
                  placeholder={t("selling.phonePlaceholder")}
                />
              </Grid>

              {/* Governorate */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.governorate}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{t("selling.governorate")}</InputLabel>
                  <Select
                    value={formData.governorate}
                    onChange={(e) =>
                      handleInputChange("governorate", e.target.value)
                    }
                    label={t("selling.governorate")}
                  >
                    {governorates.map((gov) => (
                      <MenuItem key={gov} value={gov}>
                        {gov}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.governorate && (
                    <Typography color="error" variant="caption">
                      {errors.governorate}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* City */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("selling.city")}
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder={t("selling.enterCity")}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("selling.description")}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={
                    errors.description || t("selling.describeProduct")
                  }
                  placeholder={t("selling.describeProduct")}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t("selling.images")}
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  {t("selling.maxImages")}
                </Alert>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternate />}
                    component="label"
                    disabled={imageFiles.length >= 5}
                  >
                    {t("selling.uploadGallery")}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </Button>
                  {/* Only show Take Photo on mobile devices */}
                  {typeof window !== "undefined" &&
                    /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
                      navigator.userAgent
                    ) && (
                      <Button
                        variant="outlined"
                        startIcon={<CameraAlt />}
                        onClick={handleCameraCapture}
                        disabled={imageFiles.length >= 5}
                      >
                        {t("selling.takePhoto")}
                        <input
                          id="camera-input"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                        />
                      </Button>
                    )}
                </Box>

                {/* Display uploaded images */}
                {imageFiles.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {imageFiles.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 100,
                          height: 100,
                          border: "1px solid #ddd",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Product ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.9)",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, borderTop: "1px solid #e0e0e0" }}>
            <Button onClick={handleClose} variant="outlined">
              {t("selling.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
            >
              {t("selling.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onOpenSignup={handleOpenSignup}
      />

      {/* Signup Modal */}
      <SignupModal
        open={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default SellingForm;
