import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Rating,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FilterList,
  LocationOn,
  Phone,
  Email,
  Store,
  Star,
} from "@mui/icons-material";

const ShopsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Sample shop data
  const shops = [
    {
      id: 1,
      name: "محل الطاقة الشمسية المتقدم",
      location: "صنعاء",
      phone: "+967 777 123 456",
      email: "shop1@example.com",
      address: "شارع الزبيري، صنعاء",
      image: "https://picsum.photos/id/1011/400/250",
      services: ["بيع المنتجات", "تركيب الأنظمة", "الصيانة", "الاستشارات"],
      description:
        "محل متخصص في بيع وتركيب الأنظمة الشمسية مع فريق فني محترف. نقدم خدمات شاملة في مجال الطاقة الشمسية منذ عام 2018. لدينا خبرة واسعة في تركيب الأنظمة المنزلية والتجارية والصناعية. نستخدم أحدث التقنيات والمنتجات عالية الجودة لضمان أفضل النتائج لعملائنا الكرام.",
      workingHours: "8:00 ص - 8:00 م",
      established: "2018",
    },
    {
      id: 2,
      name: "مركز الطاقة الخضراء",
      location: "عدن",
      phone: "+967 777 234 567",
      email: "shop2@example.com",
      address: "شارع الجمهورية، عدن",
      image: "https://picsum.photos/id/1012/400/250",
      services: ["بيع المنتجات", "تركيب الأنظمة", "الصيانة"],
      description: "مركز شامل لجميع احتياجات الطاقة الشمسية في عدن",
      workingHours: "9:00 ص - 9:00 م",
      established: "2019",
    },
    {
      id: 3,
      name: "محل الشمس الذهبية",
      location: "تعز",
      phone: "+967 777 345 678",
      email: "shop3@example.com",
      address: "شارع القاهرة، تعز",
      image: "https://picsum.photos/id/1013/400/250",
      services: [
        "بيع المنتجات",
        "تركيب الأنظمة",
        "الصيانة",
        "الاستشارات",
        "التصميم",
      ],
      description: "محل رائد في مجال الطاقة الشمسية مع خبرة 10 سنوات",
      workingHours: "8:30 ص - 8:30 م",
      established: "2015",
    },
    {
      id: 4,
      name: "محل الطاقة المستدامة",
      location: "الحديدة",
      phone: "+967 777 456 789",
      email: "shop4@example.com",
      address: "شارع البحر، الحديدة",
      image: "https://picsum.photos/id/1014/400/250",
      services: ["بيع المنتجات", "تركيب الأنظمة"],
      description: "محل متخصص في بيع وتركيب الأنظمة الشمسية للمنازل",
      workingHours: "8:00 ص - 7:00 م",
      established: "2020",
    },
    {
      id: 5,
      name: "محل الطاقة المتجددة",
      location: "إب",
      phone: "+967 777 567 890",
      email: "shop5@example.com",
      address: "شارع السوق، إب",
      image: "https://picsum.photos/id/1015/400/250",
      services: ["بيع المنتجات", "تركيب الأنظمة", "الصيانة", "الاستشارات"],
      description: "محل معتمد لبيع وتركيب وصيانة الأنظمة الشمسية",
      workingHours: "9:00 ص - 8:00 م",
      established: "2017",
    },
    {
      id: 6,
      name: "محل الطاقة النظيفة",
      location: "صنعاء",
      phone: "+967 777 678 901",
      email: "shop6@example.com",
      address: "شارع الستين، صنعاء",
      image: "https://picsum.photos/id/1016/400/250",
      services: ["بيع المنتجات", "الصيانة"],
      description: "محل متخصص في بيع المنتجات الشمسية وصيانتها",
      workingHours: "8:30 ص - 7:30 م",
      established: "2021",
    },
  ];

  const locations = ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت"];
  const services = [
    "بيع المنتجات",
    "تركيب الأنظمة",
    "الصيانة",
    "الاستشارات",
    "التصميم",
  ];

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !selectedLocation || shop.location === selectedLocation;
    const matchesService =
      !selectedService || shop.services.includes(selectedService);

    return matchesSearch && matchesLocation && matchesService;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
      >
        المحلات المعتمدة
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">الفلاتر</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="البحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: "1rem" }}>الموقع</InputLabel>
              <Select
                value={selectedLocation}
                label="الموقع"
                onChange={(e) => setSelectedLocation(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "1rem" }}>
                  الكل
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem
                    key={location}
                    value={location}
                    sx={{ fontSize: "1rem" }}
                  >
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: "1rem" }}>الخدمات</InputLabel>
              <Select
                value={selectedService}
                label="الخدمات"
                onChange={(e) => setSelectedService(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "1rem" }}>
                  الكل
                </MenuItem>
                {services.map((service) => (
                  <MenuItem
                    key={service}
                    value={service}
                    sx={{ fontSize: "1rem" }}
                  >
                    {service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Shops Grid */}
      <Grid container spacing={3}>
        {filteredShops.map((shop) => (
          <Grid item xs={12} sm={6} md={4} key={shop.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={shop.image}
                alt={shop.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {shop.name}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                ></Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {shop.description.length > 40
                    ? shop.description.substring(0, 40) + "..."
                    : shop.description}
                </Typography>
                {shop.description.length > 40 && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/shop/${shop.id}`);
                    }}
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      textTransform: "none",
                      color: "primary.main",
                    }}
                  >
                    عرض المزيد
                  </Button>
                )}

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOn
                    sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2">{shop.location}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Store
                    sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2">
                    تأسس في {shop.established}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Star sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2">{shop.workingHours}</Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                  {shop.services.slice(0, 2).map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      size="small"
                      color="primary"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {shop.services.length > 2 && (
                    <Chip
                      label={`+${shop.services.length - 2}`}
                      size="small"
                      color="primary"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  )}
                </Box>
              </CardContent>
              <style jsx>{`
                .MuiCardContent-root {
                  min-height: 220px;
                }
              `}</style>
              <CardActions>
                <Button size="small" color="primary" fullWidth>
                  عرض التفاصيل
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredShops.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            لم يتم العثور على محلات تطابق معايير البحث
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ShopsPage;
