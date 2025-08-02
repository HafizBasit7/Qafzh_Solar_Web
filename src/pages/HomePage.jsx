import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SolarPower,
  Engineering,
  Store,
  Calculate,
  Search,
  LocationOn,
  FilterList,
  Add,
  Bolt,
  BatteryFull,
  Cable
} from "@mui/icons-material";
import { useProducts } from "../hooks/useProducts";
import { useEngineers } from "../hooks/useEngineers";
import { useShopsQuery } from "../hooks/useShops";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  // Fetch products
  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: productsError,
    refetch: refetchProducts,
    hasNextPage: hasNextProductsPage,
    fetchNextPage: fetchNextProductsPage,
    isFetchingNextPage: isFetchingNextProductsPage
  } = useProducts({
    search_keyword: searchTerm,
    governorate: locationFilter
  });

  // Fetch engineers
  const {
    engineers,
    isLoading: isLoadingEngineers,
    isError: isErrorEngineers,
    error: engineersError,
    refetch: refetchEngineers,
    hasNextPage: hasNextEngineersPage,
    fetchNextPage: fetchNextEngineersPage,
    isFetchingNextPage: isFetchingNextEngineersPage
  } = useEngineers({
    search_keyword: searchTerm,
    governorate: locationFilter
  });

  // Fetch shops
  const {
    data: shopsData,
    isLoading: isLoadingShops,
    isError: isErrorShops,
    error: shopsError,
    refetch: refetchShops,
    hasNextPage: hasNextShopsPage,
    fetchNextPage: fetchNextShopsPage,
    isFetchingNextPage: isFetchingNextShopsPage
  } = useShopsQuery({
    search_keyword: searchTerm,
    governorate: locationFilter
  });
  const shops = shopsData?.pages?.flatMap(page => page.data) || [];

  const governorates = [
    "صنعاء",
    "عدن",
    "تعز",
    "حضرموت",
    "المكلا",
    "إب",
    "ذمار",
    "مأرب",
    "البيضاء",
    "شبوة"
  ];

  const categories = [
    { id: "Panel", name: "ألواح شمسية", icon: <SolarPower /> },
    { id: "Inverter", name: "انفرترات", icon: <Bolt /> },
    { id: "Battery", name: "بطاريات", icon: <BatteryFull /> },
    { id: "Accessory", name: "اكسسوارات", icon: <Cable /> },
    { id: "Engineers", name: "المهندسين", icon: <Engineering /> },
    { id: "Shops", name: "المتاجر", icon: <Store /> }
  ];

  const renderContent = () => {
    if (activeTab === "products") {
      if (isLoadingProducts) return <LoadingIndicator />;
      if (isErrorProducts) return <ErrorDisplay error={productsError} />;
      
      return (
        <>
          <Grid container spacing={2}>
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            ) : (
              <EmptyState message="لا توجد منتجات متاحة حالياً" />
            )}
          </Grid>
          {hasNextProductsPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                onClick={() => fetchNextProductsPage()}
                disabled={isFetchingNextProductsPage}
              >
                {isFetchingNextProductsPage ? "جاري التحميل..." : "تحميل المزيد"}
              </Button>
            </Box>
          )}
        </>
      );
    }

    if (activeTab === "engineers") {
      if (isLoadingEngineers) return <LoadingIndicator />;
      if (isErrorEngineers) return <ErrorDisplay error={engineersError} />;
      
      return (
        <>
          <Grid container spacing={2}>
            {engineers.length > 0 ? (
              engineers.map((engineer) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={engineer._id}>
                  <EngineerCard engineer={engineer} />
                </Grid>
              ))
            ) : (
              <EmptyState message="لا توجد مهندسين مسجلين حالياً" />
            )}
          </Grid>
          {hasNextEngineersPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                onClick={() => fetchNextEngineersPage()}
                disabled={isFetchingNextEngineersPage}
              >
                {isFetchingNextEngineersPage ? "جاري التحميل..." : "تحميل المزيد"}
              </Button>
            </Box>
          )}
        </>
      );
    }

    if (activeTab === "shops") {
      if (isLoadingShops) return <LoadingIndicator />;
      if (isErrorShops) return <ErrorDisplay error={shopsError} />;
      
      return (
        <>
          <Grid container spacing={2}>
            {shops.length > 0 ? (
              shops.map((shop) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={shop._id}>
                  <ShopCard shop={shop} />
                </Grid>
              ))
            ) : (
              <EmptyState message="لا توجد متاجر مسجلة حالياً" />
            )}
          </Grid>
          {hasNextShopsPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                onClick={() => fetchNextShopsPage()}
                disabled={isFetchingNextShopsPage}
              >
                {isFetchingNextShopsPage ? "جاري التحميل..." : "تحميل المزيد"}
              </Button>
            </Box>
          )}
        </>
      );
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Left Sidebar - Filters */}
      <Box sx={{ width: 250, p: 2, backgroundColor: "white", borderRight: "1px solid #e0e0e0" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          الفلاتر
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>المحافظة</InputLabel>
          <Select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            label="المحافظة"
          >
            <MenuItem value="">كل المحافظات</MenuItem>
            {governorates.map((gov) => (
              <MenuItem key={gov} value={gov}>{gov}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          التصنيفات
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {categories.map((category) => (
            <Button
              key={category.id}
              startIcon={category.icon}
              sx={{
                justifyContent: "flex-start",
                textAlign: "right",
                color: "#333",
                fontWeight: "bold"
              }}
              onClick={() => {
                if (category.id === "Engineers") {
                  setActiveTab("engineers");
                } else if (category.id === "Shops") {
                  setActiveTab("shops");
                } else {
                  setActiveTab("products");
                  // You can add additional filtering logic here
                }
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header with Search */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Paper sx={{ flex: 1, mr: 2, display: "flex" }}>
            <TextField
              fullWidth
              placeholder="ابحث عن منتجات أو خدمات شمسية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { backgroundColor: "white" }
              }}
            />
          </Paper>
          
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={{ backgroundColor: "#16A34A", "&:hover": { backgroundColor: "#15803D" } }}
            onClick={() => navigate("/add-listing")}
          >
            أضف إعلان
          </Button>
        </Box>

        {/* Content */}
        {renderContent()}

        {/* Calculator CTA */}
        <Paper sx={{ 
          backgroundColor: "#16A34A", 
          color: "white", 
          p: 4, 
          mt: 4, 
          textAlign: "center",
          borderRadius: 2
        }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            احسب احتياجاتك من الطاقة الشمسية
          </Typography>
          <Button
            variant="contained"
            startIcon={<Calculate />}
            sx={{ 
              backgroundColor: "#FFD700", 
              color: "#333", 
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#FFC400" }
            }}
            onClick={() => navigate("/calculator")}
          >
            استخدم الحاسبة الآن
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

// Component for loading state
const LoadingIndicator = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
    <CircularProgress color="success" />
  </Box>
);

// Component for error state
const ErrorDisplay = ({ error }) => (
  <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
    <Typography variant="h6">حدث خطأ أثناء جلب البيانات</Typography>
    <Typography variant="body2">{error?.message}</Typography>
    <Button variant="outlined" color="error" sx={{ mt: 2 }}>
      إعادة المحاولة
    </Button>
  </Box>
);

// Component for empty state
const EmptyState = ({ message }) => (
  <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
    <Typography variant="h6">{message}</Typography>
  </Box>
);

// Product Card Component
const ProductCard = ({ product }) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Box
      sx={{
        height: 180,
        backgroundImage: `url(${product.images?.[0] || "/placeholder-product.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {product.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "#16A34A", fontWeight: "bold", mb: 1 }}>
        {product.price} ريال
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Chip 
          label={product.governorate} 
          size="small" 
          icon={<LocationOn fontSize="small" />}
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(product.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#16A34A", "&:hover": { backgroundColor: "#15803D" } }}
        onClick={() => navigate(`/products/${product._id}`)}
      >
        عرض التفاصيل
      </Button>
    </CardContent>
  </Card>
);

// Engineer Card Component
const EngineerCard = ({ engineer }) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Box
      sx={{
        height: 180,
        backgroundImage: `url(${engineer.profileImage || "/placeholder-engineer.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {engineer.name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {engineer.specialization}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Chip 
          label={engineer.governorate} 
          size="small" 
          icon={<LocationOn fontSize="small" />}
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(engineer.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#16A34A", "&:hover": { backgroundColor: "#15803D" } }}
        onClick={() => navigate(`/engineers/${engineer._id}`)}
      >
        عرض الملف
      </Button>
    </CardContent>
  </Card>
);

// Shop Card Component
const ShopCard = ({ shop }) => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Box
      sx={{
        height: 180,
        backgroundImage: `url(${shop.logo || "/placeholder-shop.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {shop.name}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Chip 
          label={shop.governorate} 
          size="small" 
          icon={<LocationOn fontSize="small" />}
        />
        <Typography variant="caption" color="text.secondary">
          {new Date(shop.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#16A34A", "&:hover": { backgroundColor: "#15803D" } }}
        onClick={() => navigate(`/shops/${shop._id}`)}
      >
        زيارة المتجر
      </Button>
    </CardContent>
  </Card>
);

export default HomePage;