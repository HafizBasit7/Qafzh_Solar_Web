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
  CircularProgress,
  Alert,
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
import { useTranslation } from "react-i18next";
import { useShopsQuery } from "../hooks/useShops";
import { LoadingOverlay } from "../components/loaders/LoadingOverlay";

const ShopsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Initialize hooks
  const shopsHook = useShopsQuery();

  // Get shops with filters
  const {
    data: shopsData,
    isLoading: isLoadingShops,
    isError: isErrorShops,
    error: shopsError,
    refetch: refetchShops
  } = useShopsQuery({
    search_keyword: searchTerm,
    governorate: selectedLocation,
    service: selectedService,
    page,
    limit: pageSize
  });
  
  // Extract shops from API response
  const shops = shopsData?.pages?.flatMap(page => page.data) || [];
  const totalShops = shopsData?.pages?.[0]?.total || 0;
  const totalPages = Math.ceil(totalShops / pageSize);

  const locations = ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت"];
  const services = [
    "بيع المنتجات",
    "تركيب الأنظمة",
    "الصيانة",
    "الاستشارات",
    "التصميم",
  ];

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // We don't need to filter shops locally since the API handles filtering
  const filteredShops = shops;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
      >
        {t("shops.title", "المحلات المعتمدة")}
      </Typography>

      {/* Filters Section */}
      {/* <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">{t("shops.filters", "الفلاتر")}</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label={t("common.search", "البحث")}
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
              <InputLabel sx={{ fontSize: "1rem" }}>{t("common.location", "الموقع")}</InputLabel>
              <Select
                value={selectedLocation}
                label={t("common.location", "الموقع")}
                onChange={(e) => setSelectedLocation(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "1rem" }}>
                  {t("common.all", "الكل")}
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
              <InputLabel sx={{ fontSize: "1rem" }}>{t("shops.services", "الخدمات")}</InputLabel>
              <Select
                value={selectedService}
                label={t("shops.services", "الخدمات")}
                onChange={(e) => setSelectedService(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "1rem" }}>
                  {t("common.all", "الكل")}
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
      </Paper> */}

      {/* Loading State */}
      {isLoadingShops && (
        <LoadingOverlay message={t("shops.loading", "جاري تحميل المحلات...")} />
      )}

      {/* Error State */}
      {isErrorShops && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("shops.error", "حدث خطأ أثناء تحميل المحلات. يرجى المحاولة مرة أخرى.")}
        </Alert>
      )}

      {/* Shops Grid */}
      {!isLoadingShops && !isErrorShops && (
        <>
          <Grid container spacing={3}>
            {filteredShops.length > 0 ? (
              filteredShops.map((shop) => (
                <Grid item xs={12} sm={6} md={4} key={shop._id || shop.id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={shop.logoUrl || shop.image || "https://picsum.photos/id/1011/400/250"}
                      alt={shop.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {shop.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{shop.city || shop.location}</Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <Phone fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{shop.phone}</Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp:
                              expandedDescriptions[shop._id || shop.id] ? "unset" : 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            mb: 1,
                          }}
                        >
                          {shop.description}
                        </Typography>
                        {shop.description && shop.description.length > 100 && (
                          <Button
                            size="small"
                            onClick={() =>
                              setExpandedDescriptions((prev) => ({
                                ...prev,
                                [shop._id || shop.id]: !prev[shop._id || shop.id],
                              }))
                            }
                            sx={{ p: 0, minWidth: "auto" }}
                          >
                            {expandedDescriptions[shop._id || shop.id]
                              ? t("common.showLess", "عرض أقل")
                              : t("common.showMore", "عرض المزيد")}
                          </Button>
                        )}
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {t("shops.services", "الخدمات")}:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                        {shop.services && shop.services.slice(0, 3).map((service, index) => (
                          <Chip
                            key={index}
                            label={service}
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                        {shop.services && shop.services.length > 3 && (
                          <Chip
                            label={`+${shop.services.length - 3}`}
                            size="small"
                            sx={{ mb: 0.5 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="medium"
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/shop/${shop._id || shop.id}`)}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        {t("common.viewDetails", "عرض التفاصيل")}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary">
                    {t("shops.noResults", "لا توجد متاجر مطابقة لمعايير البحث")}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ShopsPage;
