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
  Slider,
  Paper,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, FilterList } from "@mui/icons-material";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Sample product data
  const products = [
    {
      id: 1,
      name: "لوح شمسي 550 واط",
      brand: "Longi",
      category: "ألواح شمسية",
      price: 2500,
      image: "https://picsum.photos/id/1015/300/200",
      description:
        "لوح شمسي عالي الكفاءة مع ضمان 25 سنة. مصمم للاستخدام المنزلي والتجاري مع كفاءة تحويل تصل إلى 21.3%. يستخدم تقنية الخلايا أحادية البلورة للحصول على أفضل أداء في جميع الظروف الجوية. مناسب للمنازل والشركات والمشاريع الصناعية.",
    },
    {
      id: 2,
      name: "بطارية ليثيوم 100Ah",
      brand: "Pylontech",
      category: "بطاريات",
      price: 1800,
      image: "https://picsum.photos/id/1025/300/200",
      description: "بطارية ليثيوم فوسفات عالية الأداء",
    },
    {
      id: 3,
      name: "محول 3000 واط",
      brand: "Growatt",
      category: "محولات",
      price: 3200,
      image: "https://picsum.photos/id/1035/300/200",
      description: "محول هجين مع شاشة LCD",
    },
    {
      id: 4,
      name: "لوح شمسي 400 واط",
      brand: "Jinko",
      category: "ألواح شمسية",
      price: 1800,
      image: "https://picsum.photos/id/1045/300/200",
      description: "لوح شمسي اقتصادي للمنازل",
    },
    {
      id: 5,
      name: "بطارية جيل 150Ah",
      brand: "Trojan",
      category: "بطاريات",
      price: 1200,
      image: "https://picsum.photos/id/1055/300/200",
      description: "بطارية جيل عميقة للأنظمة الشمسية",
    },
    {
      id: 6,
      name: "محول 5000 واط",
      brand: "SMA",
      category: "محولات",
      price: 4500,
      image: "https://picsum.photos/id/1065/300/200",
      description: "محول صناعي عالي الكفاءة",
    },
  ];

  const categories = [
    t("products.categories.solar"),
    t("products.categories.batteries"),
    t("products.categories.inverters"),
    t("products.categories.accessories"),
  ];
  const brands = ["Longi", "Jinko", "Pylontech", "Trojan", "Growatt", "SMA"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;

    return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
  });

  return (
    <Box width="100%" sx={{ py: { xs: 3, md: 4, lg: 5 } }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mb: { xs: 3, md: 4, lg: 5 },
          fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
        }}
      >
        {t("products.title")}
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            sx={{ display: "flex", alignItems: "center", mb: { xs: 1, md: 0 } }}
          >
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">{t("products.filters.title")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <TextField
              fullWidth
              label={t("products.filters.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: "1rem" }}>
                {t("products.filters.category")}
              </InputLabel>
              <Select
                value={selectedCategory}
                label={t("products.filters.category")}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="">{t("products.filters.all")}</MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{ fontSize: "1rem" }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: "1rem" }}>
                {t("products.filters.brand")}
              </InputLabel>
              <Select
                value={selectedBrand}
                label={t("products.filters.brand")}
                onChange={(e) => setSelectedBrand(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="">{t("products.filters.all")}</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand} sx={{ fontSize: "1rem" }}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Typography gutterBottom>{t("products.filters.price")}</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption">{priceRange[0]} ريال</Typography>
              <Typography variant="caption">{priceRange[1]} ريال</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Grid */}
      <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
        {filteredProducts.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product.id}
            sx={{ mx: { xs: 0.5, md: 1 } }}
          >
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
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  {product.description.length > 40
                    ? product.description.substring(0, 40) + "..."
                    : product.description}
                </Typography>
                {product.description.length > 40 && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Chip label={product.brand} size="small" color="primary" />
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    {product.price.toLocaleString()} ريال
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  fullWidth
                  sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}
                >
                  {t("products.viewDetails")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: "center", py: { xs: 6, md: 8 } }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
          >
            {t("products.noResults")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductsPage;
