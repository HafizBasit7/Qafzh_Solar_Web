import React from "react";
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
} from "@mui/icons-material";

const EngineerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample engineer data (in real app, this would come from API)
  const engineer = {
    id: parseInt(id),
    name: "أحمد محمد علي",
    location: "صنعاء",
    experience: "8 سنوات",
    rating: 4.8,
    reviews: 45,
    projects: 78,
    phone: "+967 777 123 456",
    email: "ahmed@example.com",
    image: "https://via.placeholder.com/300x300/4caf50/ffffff?text=Engineer",
    description:
      "مهندس معتمد في مجال الطاقة الشمسية مع خبرة 8 سنوات في تركيب وصيانة الأنظمة الشمسية للمنازل والشركات.",
    specialties: [
      "تركيب الأنظمة الشمسية",
      "صيانة المحولات",
      "تصميم الأنظمة",
      "حسابات الطاقة",
    ],
    certifications: [
      "شهادة معتمدة في الطاقة الشمسية - جامعة صنعاء",
      "دورة متقدمة في أنظمة المحولات - معهد الطاقة المتجددة",
      "شهادة السلامة المهنية - وزارة العمل",
    ],
    recentProjects: [
      "تركيب نظام 5 كيلو واط لمنزل في صنعاء",
      "صيانة محولات لمصنع في عدن",
      "تصميم نظام 10 كيلو واط لمدرسة في تعز",
      "تركيب ألواح شمسية لمستشفى في الحديدة",
    ],
    services: [
      "تصميم الأنظمة الشمسية",
      "تركيب الألواح والمحولات",
      "صيانة دورية للأنظمة",
      "استشارات فنية",
      "حسابات الطاقة والكفاءة",
    ],
    workingHours: "8:00 ص - 6:00 م",
    responseTime: "خلال 24 ساعة",
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/engineers")}
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        العودة للمهندسين
      </Button>

      <Paper elevation={4} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            src={engineer.image}
            sx={{ width: 140, height: 140, mb: 2, boxShadow: 2 }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {engineer.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {engineer.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {engineer.specialties.slice(0, 2).map((specialty, index) => (
              <Chip
                key={index}
                label={specialty}
                size="small"
                variant="outlined"
                sx={{ ml: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LocationOn />}
            size="medium"
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              mt: 1,
              mb: 2,
              mx: 1,
              "& .MuiButton-startIcon": {
                mr: { xs: 0.5, md: 1 },
                ml: { xs: 0.5, md: 1 },
              },
            }}
            onClick={() => {
              const query = encodeURIComponent(engineer.location);
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${query}`,
                "_blank"
              );
            }}
          >
            الانتقال إلى موقع المهندس
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsApp />}
            size="medium"
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              mt: 1,
              mb: 2,
              mx: 1,
              "& .MuiButton-startIcon": {
                mr: { xs: 0.5, md: 1 },
                ml: { xs: 0.5, md: 1 },
              },
            }}
            onClick={() => {
              const message = encodeURIComponent(
                `مرحباً، أنا مهتم بالتواصل مع المهندس: ${engineer.name}`
              );
              window.open(
                `https://wa.me/${engineer.phone.replace(
                  /\D/g,
                  ""
                )}?text=${message}`,
                "_blank"
              );
            }}
          >
            تواصل عبر واتساب
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          معلومات التواصل
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Phone sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {engineer.phone}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Email sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {engineer.email}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EngineerDetail;
