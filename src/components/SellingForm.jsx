import React, { useState, useEffect } from "react";
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
  IconButton,
  InputAdornment,
  Alert,
  Switch,
  CircularProgress,
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
import { useAuthContext } from "../contexts/AuthContext";
import { productsAPI } from "../services/api";
import { storage } from "../utils/storage";
import { useProducts } from "../hooks/useProducts";
import { uploadAPI } from "../utils/imageUpload";

const SellingForm = ({ open, onClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, userData, checkAuthStatus } = useAuthContext();

  const [formData, setFormData] = useState({
    name: '',
    type: "",
    condition: "",
    brand: "",
    model: "",
    price: "",
    currency: "YER",
    phone: "",
    whatsappPhone: "",
    governorate: "",
    city: "",
    locationText: "",
    description: "",
    images: [],
    specifications: {
      power: "",
      voltage: "",
      warranty: ""
    },
    isNegotiable: true,
    isActive: true,
    isFeatured: false,
    status: 'pending'
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication when component opens
  useEffect(() => {
    if (open) {
      console.log('🔐 SellingForm opened, checking auth status...');
      console.log('🔐 Auth status:', { isAuthenticated, hasUserData: !!userData, hasToken: !!storage.getToken() });

      const isReallyAuthenticated = checkAuthStatus();

      if (isReallyAuthenticated) {
        console.log('🔐 User is authenticated, showing form');
        setShowForm(true);
        setLoginModalOpen(false);

        // Pre-fill user data if available
        if (userData?.phone) {
          setFormData(prev => ({
            ...prev,
            phoneNumber: userData.phone
          }));
        }
      } else {
        console.log('🔐 User not authenticated, showing login modal');
        setShowForm(false);
        setLoginModalOpen(true);
      }
    }
  }, [open, isAuthenticated, userData, checkAuthStatus]);

  // Yemeni governorates
  const governorates = [
    "Sana'a", "Aden", "Taiz", "Al Hudaydah", "Ibb", "Dhamar",
    "Al Mahwit", "Raymah", "Al Jawf", "Marib", "Al Bayda",
    "Shabwah", "Hadramaut", "Al Mahrah", "Sa'dah", "Hajjah",
    "Amran", "Lahij", "Abyan", "Al Dhale'e",
  ];

  // Common solar product brands
  const commonBrands = [
    "SMA", "Fronius", "Sungrow", "Growatt", "Solis", "Victron Energy",
    "Schneider Electric", "ABB", "Delta", "Kaco", "Canadian Solar",
    "Jinko Solar", "Trina Solar", "Longi", "JA Solar", "Hanwha Q-Cells",
    "LG Solar", "Panasonic", "SunPower", "First Solar", "Other",
  ];

  // Update these arrays to match your Postman values
  const productTypes = ["Inverter", "Panel", "Battery", "Cables", "Controller", "Full Kit", "Others"];
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

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    
    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });
  
    if (validFiles.length + imageFiles.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
  
    // Upload images and get URLs
    try {
      setIsUploading(true);
      const uploadPromises = validFiles.map(file => uploadAPI.uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Update state with both the File objects and their URLs
      setImageFiles(prev => [
        ...prev,
        ...validFiles.map((file, index) => ({
          file,
          fileUrl: uploadedUrls[index].fileUrl,

          preview: URL.createObjectURL(file)
        }))
      ]);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCameraCapture = () => {
    document.getElementById("camera-input").click();
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.type) {
      newErrors.type = "Product type is required";
    }
    if (!formData.condition) {
      newErrors.condition = "Product condition is required";
    }
    if (!formData.brand) {
      newErrors.brand = "Brand is required";
    }
    if (!formData.price) {
      newErrors.price = "Price is required";
    }
    if (!formData.phone || formData.phone.trim() === '') {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (digits only, 8-15 characters)";
    }
    if (formData.whatsappPhone && !/^[0-9+\-\s()]{8,}$/.test(formData.whatsappPhone)) {
      newErrors.whatsappPhone = "Please enter a valid WhatsApp number";
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

  const {
    createProduct,
    isCreating,
    createProductError
  } = useProducts();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      // Extract URLs directly from already uploaded images
      const imageUrls = imageFiles.map(item => item.fileUrl); // ✅ Correct — just the string URLs

  
      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        condition: formData.condition,
        brand: formData.brand,
        model: formData.model || '',
        price: Number(formData.price),
        currency: formData.currency,
        phone: formData.phone,
        whatsappPhone: formData.whatsappPhone || '',
        governorate: formData.governorate,
        city: formData.city || '',
        locationText: formData.locationText || '',
        specifications: {
          power: formData.specifications.power || '',
          voltage: formData.specifications.voltage || '',
          capacity: formData.specifications.capacity || '',
          warranty: formData.specifications.warranty || ''
        },
        status: formData.status,
        isNegotiable: Boolean(formData.isNegotiable),
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.isFeatured),
        images: imageUrls // ←✅ already uploaded URLs
      };
  
      // Submit product data as JSON
      await createProduct(productData);
  
      // Reset on success
      resetForm();
      onClose();
    } catch (error) {
      console.error('❌ Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const resetForm = () => {
    setFormData({
      name: '',
      type: "",
      condition: "",
      brand: "",
      model: "",
      price: "",
      currency: "YER",
      phone: userData?.phone || "",
      whatsappPhone: "",
      governorate: "",
      city: "",
      locationText: "",
      description: "",
      images: [],
      specifications: {
        power: "",
        voltage: "",
        warranty: ""
      },
      isNegotiable: true,
      isActive: true,
      isFeatured: false,
      status: 'pending'
    });
    setErrors({});
    setImageFiles([]);
  };

  const handleLoginSuccess = () => {
    console.log('🔐 Login successful in SellingForm');
    setLoginModalOpen(false);
    setShowForm(true);

    // Pre-fill user data if available
    if (userData?.phone) {
      setFormData(prev => ({
        ...prev,
        phone: userData.phone
      }));
    }
  };

  const handleSignupSuccess = () => {
    console.log('🔐 Signup successful, opening login modal');
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleOpenSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const handleClose = () => {
    resetForm();
    setShowForm(false);
    setLoginModalOpen(false);
    setSignupModalOpen(false);
    onClose();
  };

  // Don't render the form if not authenticated
  if (open && !showForm && !loginModalOpen && !signupModalOpen) {
    return null;
  }

  return (
    <>
      {/* Main Selling Form Dialog */}
      <Dialog
        open={open && showForm}
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
            {/* Authentication Status Alert */}
            {!checkAuthStatus() && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You must be logged in to post a product. Please login to continue.
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Product Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label={t("selling.name")}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder={t("selling.namePlaceholder")}
                />
              </Grid>

              {/* Product Type */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.type}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{t("selling.productType")}</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) =>
                      handleInputChange("type", e.target.value)
                    }
                    label={t("selling.productType")}
                  >
                    {productTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && (
                    <Typography color="error" variant="caption">
                      {errors.type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Product Condition */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={!!errors.condition}
                  sx={{ minWidth: 140 }}
                >
                  <InputLabel>{t("selling.condition")}</InputLabel>
                  <Select
                    value={formData.condition}
                    onChange={(e) =>
                      handleInputChange("condition", e.target.value)
                    }
                    label={t("selling.condition")}
                  >
                    {productConditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.condition && (
                    <Typography color="error" variant="caption">
                      {errors.condition}
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

              {/* Model */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("selling.model")}
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder={t("selling.modelPlaceholder")}
                />
              </Grid>

              {/* Price and Currency */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                  <TextField
                    sx={{ flex: 1 }}
                    required
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
                  required
                  label={t("selling.phoneNumber")}
                  value={formData.phone}
                  onChange={(e) => {
                    // Keep only digits
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    handleInputChange("phone", digitsOnly);
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone || t("selling.required")}
                  placeholder={t("selling.phonePlaceholder")}
                  inputProps={{
                    maxLength: 15,
                    inputMode: 'numeric'
                  }}
                />
              </Grid>

              {/* WhatsApp Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("selling.whatsapp")}
                  value={formData.whatsappPhone}
                  onChange={(e) => handleInputChange("whatsappPhone", e.target.value)}
                  error={!!errors.whatsappPhone}
                  helperText={errors.whatsappPhone}
                  placeholder={t("selling.whatsappPlaceholder")}
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

              {/* Location Text */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("selling.locationText")}
                  value={formData.locationText}
                  onChange={(e) => handleInputChange("locationText", e.target.value)}
                  placeholder={t("selling.locationPlaceholder")}
                />
              </Grid>

              {/* Specifications Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {t("selling.specifications")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label={t("selling.power")}
                      value={formData.specifications.power}
                      onChange={(e) => handleInputChange("specifications", {
                        ...formData.specifications,
                        power: e.target.value
                      })}
                      placeholder="550W"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label={t("selling.voltage")}
                      value={formData.specifications.voltage}
                      onChange={(e) => handleInputChange("specifications", {
                        ...formData.specifications,
                        voltage: e.target.value
                      })}
                      placeholder="41V"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label={t("selling.warranty")}
                      value={formData.specifications.warranty}
                      onChange={(e) => handleInputChange("specifications", {
                        ...formData.specifications,
                        warranty: e.target.value
                      })}
                      placeholder="12 Years"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Negotiable Toggle */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>{t("selling.negotiable")}</Typography>
                  <Switch
                    checked={formData.isNegotiable}
                    onChange={(e) => handleInputChange("isNegotiable", e.target.checked)}
                    color="primary"
                  />
                </Box>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
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
                  {/* Show camera button on mobile */}
                  {/* {typeof window !== "undefined" &&
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
                    )} */}
                </Box>

                {/* Display uploaded images */}
{imageFiles.length > 0 && (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    {imageFiles.map((image, index) => (
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
          src={image.preview}
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
              disabled={isSubmitting || isUploading || !checkAuthStatus()}
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": { backgroundColor: "#1b5e20" },
                "&:disabled": { backgroundColor: "#ccc" },
              }}
            >
              {isUploading ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  {`Uploading Images (${uploadProgress}%)`}
                </>
              ) : isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  {t("selling.submitting")}
                </>
              ) : (
                t("selling.submit")
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen && !isAuthenticated}
        onClose={() => {
          setLoginModalOpen(false);
          handleClose();
        }}
        onSuccess={handleLoginSuccess}
        onOpenSignup={handleOpenSignup}
      />

      {/* Signup Modal */}
      <SignupModal
        open={signupModalOpen}
        onClose={() => {
          setSignupModalOpen(false);
          setLoginModalOpen(true);
        }}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default SellingForm;