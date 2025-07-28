import React from "react";
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
  Rating,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardActions,
  Stack,
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Sample product data (in real app, this would come from API)
  const product = {
    id: parseInt(id),
    name: "لوح شمسي 550 واط",
    brand: "Longi",
    model: "Hi-MO 5m-72-550W",
    type: "Panel",
    condition: "New",
    price: 2500,
    currency: "YER",
    image: "https://picsum.photos/id/1015/500/400",
    description: "لوح شمسي عالي الكفاءة مع ضمان 25 سنة. مصمم للاستخدام المنزلي والتجاري مع كفاءة تحويل تصل إلى 21.3%.",
    specifications: {
      power: "550W",
      voltage: "24V",
      capacity: "N/A",
      warranty: "25 Years"
    },
    isNegotiable: true,
    featured: true,
    status: "pending",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    seller: {
      name: "محل الطاقة الشمسية المتقدم",
      phone: "+967 777 123 456",
      whatsappPhone: "+967 777 123 456",
      location: {
        governorate: "صنعاء",
        city: "شارع تعز",
        locationText: "بجوار البنك المركزي"
      }
    }
  };

  const handleCallSeller = () => {
    window.location.href = `tel:${product.seller.phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`مرحباً، أنا مهتم بمنتج: ${product.name}`);
    window.open(
      `https://wa.me/${product.seller.whatsappPhone.replace(/\D/g, "")}?text=${message}`,
      "_blank"
    );
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
            {product.featured && (
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
              image={product.image}
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
                      {product.type}
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
                      {product.brand} {product.model}
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
                      {product.seller.location.city}, {product.seller.location.governorate}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Price Section */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {product.price.toLocaleString()} {product.currency === "YER" ? "﷼" : "$"}
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
                {t("products.details")}
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
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography color="text.secondary" variant="body2">
                        {t(`products.${key}`)}
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
                    {t("products.status")}: <Typography component="span" fontWeight="bold">{product.status}</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("products.listedOn")}: <Typography component="span" fontWeight="bold">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </Typography>
                  </Typography>
                  {product.expiresAt && (
                    <Typography variant="body2" color="text.secondary">
                      {t("products.expiresOn")}: <Typography component="span" fontWeight="bold">
                        {new Date(product.expiresAt).toLocaleDateString()}
                      </Typography>
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Box>

            {/* Seller Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("products.sellerInfo")}
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="body1">
                    <Phone sx={{ mr: 1, color: '#16A34A', fontSize: 20 }} />
                    {product.seller.phone}
                  </Typography>
                  {product.seller.whatsappPhone && (
                    <Typography variant="body1">
                      <WhatsApp sx={{ mr: 1, color: '#25D366', fontSize: 20 }} />
                      {product.seller.whatsappPhone}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <LocationOn sx={{ mr: 1, color: '#64748B', fontSize: 20 }} />
                    {product.seller.location.locationText}
                  </Typography>
                </Stack>
              </Paper>
            </Box>

            {/* Contact Buttons */}
            <Stack direction="row" spacing={2}>
              {product.seller.whatsappPhone && (
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
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;