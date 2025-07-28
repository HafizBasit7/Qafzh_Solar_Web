import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ImageList,
  ImageListItem,
  Modal,
  IconButton,
  Stack,
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
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const EngineerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample engineer data (in real app, this would come from API)
  const engineer = {
    id: parseInt(id),
    name: "أحمد محمد علي",
    profileImageUrl: "https://via.placeholder.com/300x300/4caf50/ffffff?text=Engineer",
    isVerified: true,
    isFeatured: true,
    specializations: ["تركيب الأنظمة الشمسية", "صيانة المحولات", "تصميم الأنظمة"],
    address: "شارع الستين",
    city: "صنعاء",
    governorate: "صنعاء",
    phone: "+967 777 123 456",
    whatsappPhone: "+967 777 123 456",
    email: "ahmed@example.com",
    notes: "متوفر للاستشارات الفنية والمعاينة المجانية",
    services: [
      "تصميم الأنظمة الشمسية",
      "تركيب الألواح والمحولات",
      "صيانة دورية للأنظمة",
      "استشارات فنية",
      "حسابات الطاقة والكفاءة",
    ],
    experience: {
      years: 8,
      description: "خبرة في تركيب وصيانة الأنظمة الشمسية للمنازل والشركات"
    },
    certifications: [
      {
        name: "شهادة معتمدة في الطاقة الشمسية",
        issuedBy: "جامعة صنعاء",
        issuedDate: "2020-01-01",
        expiryDate: "2025-01-01"
      },
      {
        name: "دورة متقدمة في أنظمة المحولات",
        issuedBy: "معهد الطاقة المتجددة",
        issuedDate: "2021-06-15",
        expiryDate: "2026-06-15"
      }
    ],
    portfolio: [
      "https://picsum.photos/id/1015/500/400",
      "https://picsum.photos/id/1016/500/400",
      "https://picsum.photos/id/1018/500/400"
    ]
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
          onClick={() => navigate("/engineers")}
          sx={{ color: 'white', fontWeight: "bold" }}
        >
          {t("common.back")}
        </Button>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
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
            {/* {engineer.isFeatured && (
              <Chip
                icon={<Star sx={{ color: '#F59E0B !important' }} />}
                label={t("ENGINEER.featured")}
                sx={{
                  bgcolor: '#FEF3C7',
                  color: '#D97706',
                  '& .MuiChip-icon': { color: '#F59E0B' }
                }}
              />
            )} */}
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {engineer.specializations.join(" • ")}
          </Typography>
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
              bgcolor: '#16A34A',
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
                <LocationOn sx={{ color: '#16A34A' }} />
                <Typography>
                  {engineer.address}, {engineer.city}, {engineer.governorate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: '#16A34A' }} />
                <Typography>{engineer.phone}</Typography>
              </Box>
              {engineer.whatsappPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WhatsApp sx={{ color: '#25D366' }} />
                  <Typography>{engineer.whatsappPhone}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#16A34A' }} />
                <Typography>{engineer.email}</Typography>
              </Box>
              {engineer.notes && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotesIcon sx={{ color: '#16A34A' }} />
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
              {engineer.services.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  sx={{
                    bgcolor: '#16A34A',
                    color: '#DCFCE7',
                    border: '1px solid #DCFCE7'
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
                <Work sx={{ color: '#16A34A' }} />
                <Typography>
                  {engineer.experience.years} {t("engineers.years")}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DescriptionIcon sx={{ color: '#16A34A' }} />
                <Typography>{engineer.experience.description}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Certifications Section */}
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
                        <SchoolIcon sx={{ color: '#16A34A' }} />
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

        {/* Portfolio Section */}
        {engineer.portfolio && engineer.portfolio.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t("engineers.portfolio")}
              </Typography>
              <ImageList cols={3} gap={16}>
                {engineer.portfolio.map((image, index) => (
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
                      alt={`Portfolio ${index + 1}`}
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
            alt="Portfolio"
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
