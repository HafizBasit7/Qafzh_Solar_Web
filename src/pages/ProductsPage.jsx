import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, FilterList } from "@mui/icons-material";
import { useProducts } from "../hooks/useProducts";
import { LoadingOverlay } from "../components/loaders/LoadingOverlay";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrand, setSelectedBrand] = useState("");

  // Use the products hook with minimal filtering
const {
    products,  // This now comes directly from the hook
    totalCount,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useProducts({
    search_keyword: searchTerm,  // Remove "all" default
    type: selectedCategory,
    brand: selectedBrand,
    min_price: priceRange[0],
    max_price: priceRange[1],
  });

  // Extract products from response data
 const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.type).filter(Boolean))];


  // Format price with currency
 const formatPrice = (product) => {
  if (!product.price) return t("products.priceNotAvailable");
  
  const formattedPrice = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(product.price);

  switch(product.currency) {
    case "USD": return `$${formattedPrice}`;
    case "SAR": return `${formattedPrice} SAR`;
    case "YER": return `${formattedPrice} YER`;
    default: return `${formattedPrice} ${product.currency || ''}`;
  }
};

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
              <Typography variant="caption">{priceRange[0]} {t("common.currency")}</Typography>
              <Typography variant="caption">{priceRange[1]} {t("common.currency")}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <LoadingOverlay message={t("products.loading")} />
        </Box>
      )}
      
      {/* Error State */}
      {isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error?.message || t("products.error")}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
        {products.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product._id}
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
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0] || "/placeholder-product.jpg"}
                alt={product.name}
                sx={{ objectFit: "cover" }}
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
                  {product.description && product.description.length > 40
                    ? product.description.substring(0, 40) + "..."
                    : product.description || t("products.noDescription")}
                </Typography>
                {product.description && product.description.length > 40 && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      textTransform: "none",
                      color: "primary.main",
                    }}
                  >
                    {t("products.viewMore")}
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
                  <Chip 
                    label={product.brand || t("products.noBrand")} 
                    size="small" 
                    color="primary" 
                  />
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    {formatPrice(product)}
                  </Typography>
                </Box>
                {product.isNegotiable && (
                  <Chip
                    label={t("products.negotiable")}
                    color="secondary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
              <Button
                size="small"
                color="primary"
                fullWidth
                sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}
              >
                {t("products.viewDetails")}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {!isLoading && products.length === 0 && (
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

      {/* Load More Button */}
      {hasNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductsPage;