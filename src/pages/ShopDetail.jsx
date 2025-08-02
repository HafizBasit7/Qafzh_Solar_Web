import React, { useState } from "react";
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
  Paper,
  Divider,
  IconButton,
  Modal,
  Stack,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  ArrowBack,
  Phone,
  Email,
  LocationOn,
  WhatsApp,
  Business,
  Language,
  Notes,
  Schedule,
  VerifiedUser,
  Close as CloseIcon,
  Facebook,
  Instagram,
  Twitter,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useShopQuery } from "../hooks/useShops";
import LoadingSpinner from "../components/loaders/LoadingOverlay";
import ErrorMessage from "../components/dialogs/ErrorDialog";

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch shop data using TanStack Query
  const {
    data: response,
    isLoading,
    isError,
    error
  } = useShopQuery(id);

  const shop = response?.data; // Access the data property from the response

  const handleCall = () => {
    if (shop?.phone) {
      window.location.href = `tel:${shop.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (shop?.whatsappPhone) {
      window.open(`https://wa.me/${shop.whatsappPhone}`, '_blank');
    }
  };

  const handleDirections = () => {
    if (shop?.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${shop.location.latitude},${shop.location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleSocialMedia = (url) => {
    if (url) window.open(url, '_blank');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || t("shops.loadingError")} />;
  }

  if (!shop) {
    return <ErrorMessage message={t("shops.notFound")} />;
  }

  // Translate service names
  const serviceTranslations = {
    sale: "Sale",
    install: "Install",
    repair: "Repair"
  };

  // Translate days
  const dayTranslations = {
    Sunday: t("common.sunday"),
    Monday: t("common.monday"),
    Tuesday: t("common.tuesday"),
    Wednesday: t("common.wednesday"),
    Thursday: t("common.thursday"),
    Friday: t("common.friday"),
    Saturday: t("common.saturday")
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3, 
        bgcolor: '#02ff04',
        p: 2,
        borderRadius: 2,
        color: 'white'
      }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/shops")}
          sx={{ color: 'white', fontWeight: "bold" }}
        >
          {t("common.back")}
        </Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
          {t("shops.title")}
        </Typography>
      </Box>

      {/* Shop Profile */}
      <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CardMedia
            component="img"
            image={shop.logoUrl || "/default-shop.png"}
            alt={shop.name}
            sx={{ 
              width: 120,
              height: 120,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {shop.name}
            </Typography>
            {shop.isVerified && (
              <Chip
                icon={<VerifiedUser sx={{ color: '#10B981 !important' }} />}
                label={t("common.verified")}
                sx={{
                  bgcolor: '#ECFDF5',
                  color: '#10B981',
                  '& .MuiChip-icon': { color: '#10B981' }
                }}
              />
            )}
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {shop.city}, {shop.governorate}
          </Typography>

          {/* Rating */}
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rating
              value={shop.rating?.average || 0}
              precision={0.5}
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({shop.rating?.count || 0} {t("common.reviews")})
            </Typography>
          </Box> */}
        </Box>
      </Paper>

      {/* Contact Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Phone />}
            onClick={handleCall}
            disabled={!shop.phone}
            sx={{
              bgcolor: '#02ff04',
              '&:hover': { bgcolor: '#15803D' },
              py: 1.5,
              borderRadius: 3
            }}
          >
            {t("common.contact")}
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsApp}
            disabled={!shop.whatsappPhone}
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
              py: 1.5,
              borderRadius: 3
            }}
          >
            {t("selling.whatsapp")}
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<LocationOn />}
            onClick={handleDirections}
            disabled={!shop.location}
            sx={{
              bgcolor: '#3B82F6',
              '&:hover': { bgcolor: '#2563EB' },
              py: 1.5,
              borderRadius: 3
            }}
          >
            {t("shops.directions")} 
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("common.contactInfo")}
            </Typography>
            <Stack spacing={2}>
              {shop.address && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: '#02ff04' }} />
                  <Typography>{shop.address}</Typography>
                </Box>
              )}
              {shop.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: '#02ff04' }} />
                  <Typography>{shop.phone}</Typography>
                </Box>
              )}
              {shop.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: '#02ff04' }} />
                  <Typography>{shop.email}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Services Section */}
        {shop.services?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("shops.servicesProvided")}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {shop.services.map((service, index) => (
                  <Chip
                    key={index}
                    label={[service] || service}
                    sx={{
                      bgcolor: '#F0FDF4',
                      color: '#166534',
                      border: '1px solid #DCFCE7'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Working Hours */}
        {shop.workingHours && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("shops.workingHours")}
              </Typography>
              <Stack spacing={2}>
                {shop.workingHours.openTime && shop.workingHours.closeTime && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Schedule sx={{ color: '#02ff04' }} />
                    <Typography>
                      {shop.workingHours.openTime} - {shop.workingHours.closeTime}
                    </Typography>
                  </Box>
                )}
                {shop.workingHours.workingDays?.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {shop.workingHours.workingDays.map((day, index) => (
                      <Chip
                        key={index}
                        label={dayTranslations[day] || day}
                        sx={{
                          bgcolor: '#EFF6FF',
                          color: '#166534',
                          border: '1px solid #DBEAFE'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        )}

        {/* Social Media */}
        {shop.socialMedia && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("shops.socialMedia")}
              </Typography>
              <Stack direction="row" spacing={2}>
                {shop.socialMedia.facebook && (
                  <IconButton
                    onClick={() => handleSocialMedia(shop.socialMedia.facebook)}
                    sx={{ 
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      '&:hover': { bgcolor: '#F1F5F9' }
                    }}
                  >
                    <Facebook sx={{ color: '#1877F2' }} />
                  </IconButton>
                )}
                {shop.socialMedia.instagram && (
                  <IconButton
                    onClick={() => handleSocialMedia(shop.socialMedia.instagram)}
                    sx={{ 
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      '&:hover': { bgcolor: '#F1F5F9' }
                    }}
                  >
                    <Instagram sx={{ color: '#E4405F' }} />
                  </IconButton>
                )}
                {shop.socialMedia.twitter && (
                  <IconButton
                    onClick={() => handleSocialMedia(shop.socialMedia.twitter)}
                    sx={{ 
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      '&:hover': { bgcolor: '#F1F5F9' }
                    }}
                  >
                    <Twitter sx={{ color: '#1DA1F2' }} />
                  </IconButton>
                )}
              </Stack>
            </Paper>
          </Grid>
        )}

        {/* Gallery */}
        {shop.images?.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("shops.gallery")}
              </Typography>
              <ImageList cols={3} gap={16}>
                {shop.images.map((image, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${shop.name} ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: 8 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>
        )}

        {/* Brands */}
        {shop.brands?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("shops.brands")}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {shop.brands.map((brand, index) => (
                  <Chip
                    key={index}
                    label={brand}
                    sx={{
                      bgcolor: '#FEF3C7',
                      color: '#D97706',
                      border: '1px solid #FDE68A'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Product Categories */}
        {shop.productCategories?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("shops.productCategories")}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {shop.productCategories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    sx={{
                      bgcolor: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #DBEAFE'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Additional Info */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("shops.additionalInfo")}
            </Typography>
            <Stack spacing={2}>
              {shop.establishedYear && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Business sx={{ color: '#02ff04' }} />
                  <Typography>
                    {t("shops.establishedYear")}: {shop.establishedYear}
                  </Typography>
                </Box>
              )}
              {shop.licenseNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VerifiedUser sx={{ color: '#02ff04' }} />
                  <Typography>
                    {t("shops.licenseNumber")}: {shop.licenseNumber}
                  </Typography>
                </Box>
              )}
              {shop.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Language sx={{ color: '#02ff04' }} />
                  <Typography>
                    <a href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} target="_blank" rel="noopener noreferrer">
                      {shop.website}
                    </a>
                  </Typography>
                </Box>
              )}
              {shop.notes && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Notes sx={{ color: '#02ff04' }} />
                  <Typography>{shop.notes}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Image Viewer Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="Gallery"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default ShopDetail;