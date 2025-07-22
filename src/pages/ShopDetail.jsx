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
  Store,
  Star,
  CheckCircle,
  AccessTime,
  WhatsApp,
} from "@mui/icons-material";

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample shop data (in real app, this would come from API)
  const shop = {
    id: parseInt(id),
    name: "محل الطاقة الشمسية المتقدم",
    location: "صنعاء",
    phone: "+967 777 123 456",
    email: "shop@example.com",
    address: "شارع الزبيري، صنعاء، اليمن",
    image: "https://picsum.photos/id/1011/600/400",
    description:
      "محل متخصص في بيع وتركيب الأنظمة الشمسية مع فريق فني محترف. نقدم خدمات شاملة في مجال الطاقة الشمسية منذ عام 2018.",
    services: [
      "بيع المنتجات",
      "تركيب الأنظمة",
      "الصيانة",
      "الاستشارات",
      "التصميم",
    ],
    products: [
      "ألواح شمسية (Longi, Jinko, Canadian Solar)",
      "بطاريات ليثيوم (Pylontech, BYD)",
      "محولات (Growatt, SMA, Fronius)",
      "أنظمة مراقبة ذكية",
      "ملحقات التركيب",
    ],
    brands: [
      "Longi",
      "Jinko",
      "Canadian Solar",
      "Pylontech",
      "BYD",
      "Growatt",
      "SMA",
    ],
    workingHours: "8:00 ص - 8:00 م",
    established: "2018",
    teamSize: "15 موظف",
    projectsCompleted: "150+ مشروع",
    warranty: "ضمان شامل على جميع المنتجات",
    paymentOptions: ["نقداً", "شيكات", "تقسيط", "تحويل بنكي"],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/shops")}
        sx={{ mb: 3 }}
      >
        العودة للمحلات
      </Button>

      {/* Main Shop Profile */}
      <Paper elevation={4} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={shop.image}
              alt={shop.name}
              sx={{
                width: "100%",
                height: 300,
                objectFit: "cover",
                borderRadius: 3,
                boxShadow: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                {shop.name}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  textAlign: { xs: "center", md: "right" },
                }}
              >
                {shop.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LocationOn />}
                  size="medium"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    minWidth: "fit-content",
                    "& .MuiButton-startIcon": {
                      mr: { xs: 0.5, md: 1 },
                      ml: { xs: 0.5, md: 1 },
                    },
                  }}
                  onClick={() => {
                    const query = encodeURIComponent(shop.address);
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${query}`,
                      "_blank"
                    );
                  }}
                >
                  الانتقال إلى موقع المحل
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<WhatsApp />}
                  size="medium"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    minWidth: "fit-content",
                    "& .MuiButton-startIcon": {
                      mr: { xs: 0.5, md: 1 },
                      ml: { xs: 0.5, md: 1 },
                    },
                  }}
                  onClick={() => {
                    const message = encodeURIComponent(
                      `مرحباً، أنا مهتم بالتواصل مع المحل: ${shop.name}`
                    );
                    window.open(
                      `https://wa.me/${shop.phone.replace(
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
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Services and Brands */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              الخدمات المقدمة
            </Typography>
            <List sx={{ p: 0 }}>
              {shop.services.map((service, index) => (
                <ListItem key={index} sx={{ py: 1, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={service}
                    sx={{
                      textAlign: "right",
                      "& .MuiListItemText-primary": {
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              العلامات التجارية المعتمدة
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              {shop.brands.map((brand, index) => (
                <Chip
                  key={index}
                  label={brand}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Statistics */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          إحصائيات المحل
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {shop.teamSize}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                حجم الفريق
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {shop.projectsCompleted}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                المشاريع المنجزة
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                color="primary"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {shop.established}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                سنة التأسيس
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information */}
      <Paper sx={{ p: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          معلومات التواصل
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "row", md: "row-reverse" },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-end" },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    الهاتف
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {shop.phone}
                  </Typography>
                </Box>
                <Phone
                  sx={{
                    color: "primary.main",
                    ml: { xs: 1, md: 2 },
                    mr: { xs: 0, md: 0 },
                    fontSize: 28,
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "row", md: "row-reverse" },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-end" },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    البريد الإلكتروني
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {shop.email}
                  </Typography>
                </Box>
                <Email
                  sx={{
                    color: "primary.main",
                    ml: { xs: 1, md: 2 },
                    mr: { xs: 0, md: 0 },
                    fontSize: 28,
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "row", md: "row-reverse" },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-end" },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    العنوان
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {shop.address}
                  </Typography>
                </Box>
                <LocationOn
                  sx={{
                    color: "primary.main",
                    ml: { xs: 1, md: 2 },
                    mr: { xs: 0, md: 0 },
                    fontSize: 28,
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "row", md: "row-reverse" },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-end" },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    ساعات العمل
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {shop.workingHours}
                  </Typography>
                </Box>
                <AccessTime
                  sx={{
                    color: "primary.main",
                    ml: { xs: 1, md: 2 },
                    mr: { xs: 0, md: 0 },
                    fontSize: 28,
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ShopDetail;
