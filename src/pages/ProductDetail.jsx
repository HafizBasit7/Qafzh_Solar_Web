import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardActions,
  Stack,
  Skeleton,
  Alert,
  Dialog,
  DialogContent,
  IconButton
} from "@mui/material";
import {
  ArrowBack,
  Phone,
  LocationOn,
  WhatsApp,
  Star as StarIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  FlashOn as FlashOnIcon,
  Speed as SpeedIcon,
  GridOn as GridOnIcon,
  BatteryChargingFull as BatteryIcon,
  Power as PowerIcon,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Close
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useProduct, useUpdateProductViews } from "../hooks/useProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const updateViewsMutation = useUpdateProductViews();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);


  const PRODUCT_TYPES = useMemo(() => [
    { id: "all", name: t("products.filters.all"), icon: null },
    { id: "Panel", name: t("products.categories.solar")},
    { id: "Inverter", name: t("products.categories.inverters") },
    { id: "Battery", name: t("products.categories.batteries") },
    { id: "Panel bases", name: t("products.categories.panel_base") },
    { id: "Accessory", name: t("products.categories.accessories") },
    { id: "Other", name: t("products.categories.others") },
  ], [t]);

  // Update view count when product loads
  useEffect(() => {
    if (product?._id) {
      updateViewsMutation.mutate(product._id);
    }
  }, [product?._id]);

  const handleCallSeller = () => {
    if (!product?.phone) return;
    window.location.href = `tel:${product.phone}`;
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setOpenLightbox(true);
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };
  
  const handleWhatsApp = () => {
    if (!product?.whatsappPhone) return;
    const message = encodeURIComponent(
      t("products.whatsappMessage", { productName: product.name })
    );
    window.open(
      `https://wa.me/${product.whatsappPhone.replace(/\D/g, "")}?text=${message}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" height={40} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="error">
          {error?.message || t("products.errorLoading")}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          {t("common.back")}
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="warning">{t("products.notFound")}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          {t("common.back")}
        </Button>
      </Container>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format price with currency
  const formatPrice = (price, currency) => {
    if (!price) return t("products.priceNotAvailable");
    const formatted = new Intl.NumberFormat().format(price);
    switch (currency) {
      case "USD": return `$${formatted}`;               // US Dollar (symbol before)
      case "SAR": return `${formatted} ر.س`;           // Saudi Riyal (Arabic symbol after)
      case "YER": return `${formatted} ﷼`;             // Northern Yemeni Rial (Arabic symbol)
      case "YER_SOUTH": return `${formatted} ﷼ ج`;     // Southern Yemeni Rial (with ج for جنوبي)
      default: return `${formatted} ${currency || ''}`;
    }
    
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3, 
        bgcolor: '#2e7d32',
        p: 2,
        borderRadius: 2,
        color: 'white'
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ color: 'white', fontWeight: "bold" }}
        >
          {t("common.back")}
        </Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
          {t("products.details")}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {product.isFeatured && (
              <Chip
                icon={<StarIcon sx={{ color: '#F59E0B !important' }} />}
                label={t("products.featured")}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: '#FEF3C7',
                  color: '#D97706',
                  zIndex: 1,
                }}
              />
            )}
           {/* Main Image with Zoom */}
           <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={product.images?.[selectedImage] || "/placeholder-product.jpg"}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: 400,
                  objectFit: "cover",
                  cursor: 'pointer',
                }}
                onClick={() => handleImageClick(selectedImage)}
              />
              {product.images?.length > 1 && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    }
                  }}
                  onClick={() => handleImageClick(selectedImage)}
                >
                  <ZoomIn />
                </IconButton>
              )}
            </Box>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <Box sx={{
                display: 'flex',
                gap: 1,
                p: 2,
                overflowX: 'auto',
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                {product.images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      position: 'relative',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'primary.main',
                      }
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      image={img}
                      alt={`${product.name} - ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

              {/* Lightbox Dialog */}
      <Dialog
        open={openLightbox}
        onClose={() => setOpenLightbox(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'rgba(0,0,0,0.9)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
            onClick={() => setOpenLightbox(false)}
          >
            <Close />
          </IconButton>

          {product.images?.length > 1 && (
            <>
              <IconButton
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  zIndex: 1,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  }
                }}
                onClick={handlePrevImage}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  zIndex: 1,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  }
                }}
                onClick={handleNextImage}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh',
              p: 2
            }}
          >
            <CardMedia
              component="img"
              image={product.images?.[selectedImage] || "/placeholder-product.jpg"}
              alt={product.name}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>

          {product.images?.length > 1 && (
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}>
              {product.images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: selectedImage === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
              {product.name}
            </Typography>

            {/* Basic Details Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                  <Stack spacing={1} alignItems="flex-start">
                    <CategoryIcon sx={{ color: '#64748B' }} />
                    <Typography color="text.secondary" variant="body2">
                      {t("products.type")}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {PRODUCT_TYPES.find(t => t.id === product.type)?.name || t("products.notSpecified")}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                  <Stack spacing={1} alignItems="flex-start">
                    <BuildIcon sx={{ color: '#64748B' }} />
                    <Typography color="text.secondary" variant="body2">
                      {t("products.condition")}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={product.condition === "New" ? "#10B981" : "#F59E0B"}
                    >
                      {product.condition === "New" ? t("products.new") : t("products.used")}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                  <Stack spacing={1} alignItems="flex-start">
                    <BusinessIcon sx={{ color: '#64748B' }} />
                    <Typography color="text.secondary" variant="body2">
                      {t("selling.brand")}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {product.brand || t("products.notSpecified")} {product.model && `(${product.model})`}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                  <Stack spacing={1} alignItems="flex-start">
                    <LocationOn sx={{ color: '#64748B' }} />
                    <Typography color="text.secondary" variant="body2">
                      {t("products.location")}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {product.city}, {product.governorate}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Price Section */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatPrice(product.price, product.currency)}
                </Typography>
                {product.isNegotiable && (
                  <Typography color="#F59E0B" variant="subtitle1">
                    {t("products.negotiable")}
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("selling.description")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description || t("products.noDescription")}
              </Typography>
            </Box>

            {/* Specifications */}
            {/* <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("products.specifications")}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Grid container spacing={2}>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography color="text.secondary" variant="body2">
                        {t(`products.${key}`) || key}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {value || t("products.notSpecified")}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box> */}

            {/* Status Section */}
            <Box sx={{ mb: 3 }}>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t("products.status")}: <Typography component="span" fontWeight="bold">
                      {t(`${product.status}`)}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("products.postedAt")}: <Typography component="span" fontWeight="bold">
                      {formatDate(product.postedAt)}
                    </Typography>
                  </Typography>
                  {product.expiresAt && (
                    <Typography variant="body2" color="text.secondary">
                      {t("products.expiresAt")}: <Typography component="span" fontWeight="bold">
                        {formatDate(product.expiresAt)}
                      </Typography>
                    </Typography>
                  )}
                  {/* <Typography variant="body2" color="text.secondary">
                    {t("products.views")}: <Typography component="span" fontWeight="bold">
                      {product.viewCount || 0}
                    </Typography>
                  </Typography> */}
                </Stack>
              </Paper>
            </Box>

        {/* Contact Info */}
<Box sx={{ mb: 3 }}>
  <Typography variant="h6" gutterBottom fontWeight="bold">
    {t("common.contactInfo")}
  </Typography>
  <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
    <Stack spacing={2}>
      {product.phone && (
        <Typography variant="body1">
          <Phone sx={{ mr: 1, color: '#2e7d32', fontSize: 20 }} />
          {product.phone}
        </Typography>
      )}
      {product.whatsappPhone && (
        <Typography variant="body1">
          <WhatsApp sx={{ mr: 1, color: '#25D366', fontSize: 20 }} />
          {product.whatsappPhone}
        </Typography>
      )}
      {product.locationText && (
        <Typography variant="body1">
          <LocationOn sx={{ mr: 1, color: '#64748B', fontSize: 20 }} />
          {product.locationText}
        </Typography>
      )}
    </Stack>
  </Paper>
</Box>

{/* WhatsApp Contact Button Only */}
{product.whatsappPhone && (
  <Stack direction="row">
    <Button
      variant="contained"
      startIcon={<WhatsApp />}
      onClick={handleWhatsApp}
      fullWidth
      sx={{
        bgcolor: '#25D366',
        '&:hover': { bgcolor: '#128C7E' },
        py: 1.5,
        borderRadius: 3
      }}
    >
      {t("products.whatsapp")}
    </Button>
  </Stack>
)}

            
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;