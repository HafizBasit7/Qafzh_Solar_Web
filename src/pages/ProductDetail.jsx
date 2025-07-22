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
} from "@mui/material";
import {
  ArrowBack,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  WhatsApp,
} from "@mui/icons-material";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample product data (in real app, this would come from API)
  const product = {
    id: parseInt(id),
    name: "لوح شمسي 550 واط",
    brand: "Longi",
    category: "ألواح شمسية",
    price: 2500,
    image: "https://picsum.photos/id/1015/500/400",
    description:
      "لوح شمسي عالي الكفاءة مع ضمان 25 سنة. مصمم للاستخدام المنزلي والتجاري مع كفاءة تحويل تصل إلى 21.3%.",
    specifications: [
      "القدرة: 550 واط",
      "الجهد: 24 فولت",
      "الكفاءة: 21.3%",
      "الأبعاد: 1765 × 1048 × 35 مم",
      "الوزن: 26.5 كجم",
      "الضمان: 25 سنة",
      "نوع الخلية: Monocrystalline",
      "إطار الألمنيوم: مقاوم للتآكل",
    ],
    features: [
      "كفاءة عالية في تحويل الطاقة",
      "مقاوم للظروف الجوية القاسية",
      "سهولة التركيب والصيانة",
      "ضمان شامل لمدة 25 سنة",
      "متوافق مع جميع أنواع المحولات",
    ],
    seller: {
      name: "محل الطاقة الشمسية المتقدم",
      phone: "+967 777 123 456",
      email: "shop@example.com",
      location: "صنعاء، اليمن",
    },
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/products")}
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        العودة للمنتجات
      </Button>

      <Paper elevation={4} sx={{ borderRadius: 4, p: { xs: 2, md: 4 }, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Product Image */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  height: 320,
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              />
            </Box>
          </Grid>
          {/* Product Info */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                {product.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Chip
                  label={product.brand}
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                />
                <Chip
                  label={product.category}
                  variant="outlined"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                {product.price.toLocaleString()} ريال يمني
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                {product.description}
              </Typography>
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
                  const query = encodeURIComponent(product.seller.location);
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${query}`,
                    "_blank"
                  );
                }}
              >
                الانتقال إلى موقع البائع
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
                    `مرحباً، أنا مهتم بمنتج: ${product.name}`
                  );
                  window.open(
                    `https://wa.me/${product.seller.phone.replace(
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
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 2 }}>
        {/* Specifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              المواصفات الفنية
            </Typography>
            <List>
              {product.specifications.map((spec, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={spec} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Features */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              المميزات
            </Typography>
            <List>
              {product.features.map((feature, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Seller Information */}
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          mt: 4,
          borderLeft: "6px solid",
          borderColor: "primary.main",
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {product.seller.name}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: "text.secondary",
                mb: 1,
                fontSize: "1.1rem",
              }}
            >
              {product.seller.location}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1, color: "primary.main", fontSize: 24 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {product.seller.phone}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Email sx={{ mr: 1, color: "primary.main", fontSize: 24 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {product.seller.email}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ProductDetail;
