import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  ImageList,
  ImageListItem,
  Modal,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Phone,
  Email,
  LocationOn,
  Work,
  CheckCircle,
  Star,
  WhatsApp,
  School as SchoolIcon,
  VerifiedUser as VerifiedUserIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Notes as NotesIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  Visibility as VisibilityIcon,
  ContactMail as ContactMailIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useEngineer } from "../hooks/useEngineers";

const EngineerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  
  const { data: response, isLoading, isError, error } = useEngineer(id);
  const engineer = response?.data;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !engineer) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">
          {error?.message || "حدث خطأ أثناء جلب بيانات المهندس"}
        </Typography>
        <Button onClick={() => navigate("/engineers")} sx={{ mt: 2 }}>
          العودة إلى قائمة المهندسين
        </Button>
      </Container>
    );
  }

  const currencyMap = {
    usd: "USD ($)",
    sar: "SAR (﷼)",
    "yer-s": "Yemeni Rial - South (﷼)",
    "yer-n": "Yemeni Rial - North (﷼)",
  };
  
  // Format working days for display
  const workingDaysDisplay = engineer.availability?.workingDays?.join("، ") || "غير متوفر";
  // Format working hours for display
  const workingHoursDisplay = engineer.availability?.workingHours 
    ? `${engineer.availability.workingHours.start} - ${engineer.availability.workingHours.end}`
    : "غير محدد";

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
          onClick={() => navigate("/engineers")}
          sx={{ color: 'white', fontWeight: "bold" }}
        >
          {t("common.back")}
        </Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold',  }}>
          {t("engineers.title")}
        </Typography>
      </Box>

      {/* Profile Section */}
      <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            src={engineer.profileImageUrl}
            sx={{ 
              width: 120, 
              height: 120, 
              mx: 'auto',
              mb: 2,
              boxShadow: 2 
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {engineer.name}
            </Typography>
            {engineer.isVerified && (
              <Chip
                icon={<VerifiedUserIcon sx={{ color: '#10B981 !important' }} />}
                label={t("common.verified")}
                sx={{
                  bgcolor: '#ECFDF5',
                  color: '#10B981',
                  '& .MuiChip-icon': { color: '#10B981' }
                }}
              />
            )}
            {engineer.isFeatured && (
              <Chip
                icon={<Star sx={{ color: '#F59E0B !important' }} />}
                label={t("engineers.featured")}
                sx={{
                  bgcolor: '#FEF3C7',
                  color: '#D97706',
                  '& .MuiChip-icon': { color: '#F59E0B' }
                }}
              />
            )}
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {engineer.specializations?.join(" • ")}
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
            {/* <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {engineer.views || 0}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {t("engineers.views")}
              </Typography>
            </Box> */}
            {/* <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ContactMailIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {engineer.contactsCount || 0}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {t("engineers.contacts")}
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </Paper>

      {/* Contact Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Phone />}
            onClick={() => window.location.href = `tel:${engineer.phone}`}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#15803D' },
              py: 1.5,
              borderRadius: 3
            }}
          >
            {t("common.phone")}
          </Button>
        </Grid>
        {engineer.whatsappPhone && (
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsApp />}
              onClick={() => window.open(`https://wa.me/${engineer.whatsappPhone.replace(/\D/g, '')}`)}
              sx={{
                bgcolor: '#25D366',
                '&:hover': { bgcolor: '#128C7E' },
                py: 1.5,
                borderRadius: 3
              }}
            >
              {t("engineers.whatsapp")}
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={4}>
        {/* Basic Info Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("engineers.info")}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* <LocationOn sx={{ color: '#2e7d32' }} /> */}
                {/* <Typography>
                  {engineer.address}, {engineer.city}, {engineer.governorate}
                </Typography> */}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: '#2e7d32' }} />
                <Typography>{engineer.phone}</Typography>
              </Box>
              {engineer.whatsappPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WhatsApp sx={{ color: '#25D366' }} />
                  <Typography>{engineer.whatsappPhone}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#2e7d32' }} />
                <Typography>{engineer.email}</Typography>
              </Box>
              {engineer.notes && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotesIcon sx={{ color: '#2e7d32' }} />
                  <Typography>{engineer.notes}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Services Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("common.services")}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {engineer.services?.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  sx={{
                    bgcolor: '#2e7d32',
                    color: '#DCFCE7',
                    border: '1px solid #DCFCE7'
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
              {t("common.specifications")}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {engineer.specializations?.map((specialization, index) => (
                <Chip
                  key={index}
                  label={specialization}
                  sx={{
                    bgcolor: '#2563EB',
                    color: '#DBEAFE',
                    border: '1px solid #DBEAFE'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Experience Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("engineers.experience")}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Work sx={{ color: '#2e7d32' }} />
                <Typography>
                  {engineer.experience?.years || 0} {t("engineers.years")}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DescriptionIcon sx={{ color: '#2e7d32' }} />
                <Typography>{engineer.experience?.description || t("engineers.noDescription")}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Pricing & Availability Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t("products.filters.price")}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MonetizationOnIcon sx={{ color: '#2e7d32' }} />
                <Typography>
  {t("common.hourlyRate")}:{" "}
  {engineer.pricing?.hourlyRate || 0}{" "}
  {currencyMap[engineer.pricing?.currency?.toLowerCase()] || engineer.pricing?.currency || "USD"}
</Typography>

              </Box>
              {engineer.pricing?.minimumCharge && (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <MonetizationOnIcon sx={{ color: '#2e7d32' }} />
    <Typography>
      {t("common.minimumCharge")}:{" "}
      {engineer.pricing.minimumCharge}{" "}
      {currencyMap[engineer.pricing?.currency?.toLowerCase()] || engineer.pricing?.currency || "USD"}
    </Typography>
  </Box>
)}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon sx={{ color: '#2e7d32' }} />
                <Typography>
                  {t("products.status")}: {engineer.availability?.status || t("engineers.unknown")}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon sx={{ color: '#2e7d32' }} />
                <Typography>
                  {t("common.workingHours")}: {workingHoursDisplay}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon sx={{ color: '#2e7d32' }} />
                <Typography>
                  {t("common.workingDays")}: {workingDaysDisplay}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Certifications Section */}
        {engineer.certifications?.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("engineers.certifications")}
              </Typography>
              <Grid container spacing={2}>
                {engineer.certifications.map((cert, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        bgcolor: '#F8FAFC',
                        borderRadius: 3,
                        border: '1px solid #F1F5F9'
                      }}
                    >
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon sx={{ color: '#2e7d32' }} />
                          <Typography fontWeight="bold">{cert.name}</Typography>
                        </Box>
                        <Typography color="text.secondary">{cert.issuedBy}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("engineers.issued")}: {new Date(cert.issuedDate).toLocaleDateString()}
                        </Typography>
                        {cert.expiryDate && (
                          <Typography variant="body2" color="text.secondary">
                            {t("engineers.expires")}: {new Date(cert.expiryDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Portfolio Section */}
        {engineer.portfolioImages?.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("engineers.portfolio")}
              </Typography>
              <ImageList cols={3} gap={16}>
                {engineer.portfolioImages.map((image, index) => (
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
                      alt={`${t("engineers.portfolioImage")} ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: 8 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>
        )}
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
            alt={t("engineers.portfolioView")}
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

export default EngineerDetail;