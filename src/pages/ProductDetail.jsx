import React, { useEffect } from "react";
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
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useProduct, useUpdateProductViews } from "../hooks/useProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const updateViewsMutation = useUpdateProductViews();

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
          onClick={() => navigate("/products")}
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
      case "USD": return `$${formatted}`;
      case "SAR": return `${formatted} SAR`;
      case "YER": return `${formatted} YER`;
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
        bgcolor: '#16A34A',
        p: 2,
        borderRadius: 2,
        color: 'white'
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
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
            <CardMedia
              component="img"
              image={product.images?.[0] || "/placeholder-product.jpg"}
              alt={product.name}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
              }}
            />
          </Paper>
        </Grid>

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
                      {product.type || t("products.notSpecified")}
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
                      {t("products.brand")}
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
                {t("products.description")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.description || t("products.noDescription")}
              </Typography>
            </Box>

            {/* Specifications */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("products.specifications")}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Grid container spacing={2}>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography color="text.secondary" variant="body2">
                        {t(`products.specs.${key}`) || key}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {value || t("products.notSpecified")}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>

            {/* Status Section */}
            <Box sx={{ mb: 3 }}>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t("products.status")}: <Typography component="span" fontWeight="bold">
                      {t(`products.statuses.${product.status}`)}
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
                  <Typography variant="body2" color="text.secondary">
                    {t("products.views")}: <Typography component="span" fontWeight="bold">
                      {product.viewCount || 0}
                    </Typography>
                  </Typography>
                </Stack>
              </Paper>
            </Box>

            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("products.contactInfo")}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Stack spacing={2}>
                  {product.phone && (
                    <Typography variant="body1">
                      <Phone sx={{ mr: 1, color: '#16A34A', fontSize: 20 }} />
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

            {/* Contact Buttons */}
            <Stack direction="row" spacing={2}>
              {product.whatsappPhone && (
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
              )}
              {product.phone && (
                <Button
                  variant="contained"
                  startIcon={<Phone />}
                  onClick={handleCallSeller}
                  fullWidth
                  sx={{
                    bgcolor: '#16A34A',
                    '&:hover': { bgcolor: '#15803D' },
                    py: 1.5,
                    borderRadius: 3
                  }}
                >
                  {t("products.callSeller")}
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;