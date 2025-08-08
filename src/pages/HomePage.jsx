import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Badge,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Place as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  FavoriteBorder as FavoriteIcon,
  RemoveRedEye as EyeIcon,
  AccessTime as TimeIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
  SolarPower as SolarPanelIcon,
  FlashOn as InverterIcon,
  BatteryFull as BatteryIcon,
  Build as AccessoriesIcon,
  Money as MoneyIcon,
  Refresh as RefreshIcon,
  GridOn as PanelBaseIcon,       
  Category as OthersIcon,        
} from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const governorates = [
  {
    "name": "أبين",
    "cities": ["زنجبار", "خنفر", "لودر", "مودية", "سيبان", "أحور"]
  },
  {
    "name": "عدن",
    "cities": ["كريتر", "المعلا", "التواهي", "الشيخ عثمان", "المنصورة", "دار سعد", "البريقة", "خور مكسر"]
  },
  {
    "name": "البيضاء",
    "cities": ["البيضاء", "رداع", "مكيراس", "ناطع", "سباح", "ولد ربيع", "الصومعة", "الزاهر"]
  },
  {
    "name": "الضالع",
    "cities": ["الضالع", "دمت", "قعطبة", "الأزارق", "جحاف", "الحصين", "الشعيب", "جبن"]
  },
  {
    "name": "الحديدة",
    "cities": ["الحديدة", "باجل", "الخوخة", "اللُحية", "الصليف", "بيت الفقيه", "زبيد", "المنصورية", "التحيتا", "حيس", "المغلاف", "الجراحي", "كمران", "الدريهمي", "القناوص", "وادي مور", "الزيدية", "التحيتا", "الخوخة", "حرف سفيان", "الشمايتين", "المراوعة", "بُرع"]
  },
  {
    "name": "الجوف",
    "cities": ["الحزم", "خب والشعف", "برط العنان", "الخلق", "المطمة", "الغيل", "رجوزة", "الزاهر", "الحميدات", "خب والشعف", "المتون"]
  },
  {
    "name": "المهرة",
    "cities": ["الغيضة", "سيحوت", "قشن", "المسيلة", "حوف", "منعر", "شحن", "حصوين", "فرطك"]
  },
  {
    "name": "المحويت",
    "cities": ["المحويت", "الخبت", "حفاش", "شبام كوكبان", "ملحان", "بني سعد", "الرجم", "الطويلة", "الرجم"]
  },

  {
    "name": "عمران",
    "cities": ["عمران", "ريدة", "حرف سفيان", "خارف", "القفلة", "السودة", "بني صريم", "مسور", "عيال سريح", "جبل عيال يزيد", "ثلاء", "حبور ظليمة", "السود", "المدان", "سوير", "شهيد ناجي", "ذي بين"]
  },
  {
    "name": "ذمار",
    "cities": ["ذمار", "عنس", "الحداء", "ميفعة عنس", "عتمة", "جهران", "دوران عنس", "مغرب عنس", "المنار", "وصاب السافل", "وصاب العالي", "جبل الشرق"]
  },
  {
    "name": "حضرموت",
    "cities": ["المكلا", "سيئون", "الشحر", "تريم", "شبام", "وادي حضرموت", "قطن", "يابوث", "حجر الصيعر", "دوعن", "الريدة", "القطن", "عمد", "رخية", "ثمود", "سيح الأر", "العبر", "مأرب الوادي", "حورة", "زمخ ومنوخ", "الوديعة", "غيل باوزير", "هجم", "مكيراس", "الريدة وقصيعر", "الديس", "رممة", "المكلا", "مكيراس", "القائمة", "السوم", "الروضة", "الثلوث", "التنعيم", "برهوت", "يشبم"]
  },
  {
    "name": "حجة",
    "cities": ["حجة", "عبس", "حرض", "ميدي", "مستباء", "أفلح اليمن", "قفل شمر", "نجرة", "بكيل المير", "الجميمة", "المفتاح", "الشغادرة", "وشحة", "كُحلان الشرف", "كعيدنة", "أفلح الشام", "بني قيس", "شهارة", "السلام", "أوبينة", "ريف حجة", "أسلم", "لاعة", "المغربة", "الشاهل", "كُشر"]
  },
  {
    "name": "إب",
    "cities": ["إب", "جبلة", "بعدان", "حبيش", "السياني", "المشنة", "السبرة", "مذيخرة", "القفر", "يافع", "النادرة", "ذي السفال", "العدين", "حزم العدين", "فرع العدين", "السدة", "الشاعر", "المخادر", "الرُضمة"]
  },
  {
    "name": "لحج",
    "cities": ["الحوطة", "تبن", "الحليمين", "ردفان", "يهر", "الوديعة", "القبيطة", "المضاربة ورأس العارة", "الملاح", "المقاطرة", "طور الباحة", "يافع", "الحد", "السعيد"]
  },
  {
    "name": "مأرب",
    "cities": ["مأرب", "صرواح", "رغوان", "ماهلية", "حريب", "الجوبة", "بدبدة", "رحبة", "حريب القراميش", "مجزر", "العبدية", "مدغل", "جبل مراد", "رحبة"]
  },
  {
    "name": "ريمة",
    "cities": ["الجبين", "بلاد الطعام", "كُسمة", "السلفية", "مُزهر", "السلفية"]
  },
  {
    "name": "صعدة",
    "cities": ["صعدة", "حيدان", "كتاف والبقع", "الظاهر", "رازح", "الحشوة", "مجزر", "سحار", "كتاف", "الصفراء", "شدا", "قطابر", "باقم", "منبه", "غمر", "ساقين", "البقع", "البقع"]
  },
  {
    "name": "صنعاء",
    "cities": ["سنحان", "خولان", "بني مطر", "الحصن", "جحانة", "همدان", "نهم", "بني حشيش", "مناخة", "همدان", "صعفان", "أرحب", "الطيال", "بلاد الروس", "الحيمة الخارجية", "بني ضبيان"]
  },
  {
    "name": "شبوة",
    "cities": ["عتق", "الروضة", "ميفعة", "نصاب", "مرخة السفلى", "مرخة العليا", "حطيب", "عسيلان", "رضوم", "جردان", "ضَهر", "بيحان", "عين", "السعيد", "عرمة", "الطلح", "حبّان"]
  },
  {
    "name": "سقطرى",
    "cities": ["حديبو", "مومي", "قلنسية", "عبد الكوري"]
  },
  {
    "name": "تعز",
    "cities": ["تعز", "التربة", "صبر الموادم", "الشمايتين", "دمنت خدير", "الوازعية", "شرعب الرونة", "شرعب السلام", "جبل حبشي", "المظفر", "القاهرة", "صالة", "مقبنة", "المسراخ", "موزع", "الصلو", "سامع", "المعافر", "المخا", "ذباب", "برة", "حيفان", "ماوية", "المواسط"]
  }
];



const CONDITION_OPTIONS = [
  { id: "all", name: "الكل" },
  { id: "New", name: "جديد" },
  { id: "Used", name: "مستعمل" },
];

const SORT_OPTIONS = [
  { id: "newest", name: "الأحدث", field: "createdAt", order: "desc" },
  { id: "oldest", name: "الأقدم", field: "createdAt", order: "asc" },
  { id: "price_asc", name: "السعر من الأقل", field: "price", order: "asc" },
  { id: "price_desc", name: "السعر من الأعلى", field: "price", order: "desc" },
];

const CURRENCY_SYMBOLS = {
  USD: "$",
  SAR: "ر.س",
  YER: "﷼ ",
  YER_SOUTH: "﷼ ج"
};



export default function HomePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State for filters
  const [activeProductType, setActiveProductType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  
  // Modal states
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showGovernoratesModal, setShowGovernoratesModal] = useState(false);


  const PRODUCT_TYPES = useMemo(() => [
    { id: "all", name: t("products.filters.all"), icon: null },
    { id: "Panel", name: t("products.categories.solar"), icon: <SolarPanelIcon /> },
    { id: "Inverter", name: t("products.categories.inverters"), icon: <InverterIcon /> },
    { id: "Battery", name: t("products.categories.batteries"), icon: <BatteryIcon /> },
    { id: "Panel bases", name: t("products.categories.panel_base"), icon: <PanelBaseIcon  /> },
    { id: "Accessory", name: t("products.categories.accessories"), icon: <AccessoriesIcon /> },
    { id: "Other", name: t("products.categories.others"), icon: <OthersIcon  /> },
  ], [t]);


  const CONDITION_OPTIONS = [
    { id: "all", name: t("products.filters.all") },
    { id: "New", name: t("products.filters.conditions.new") },
    { id: "Used", name: t("products.filters.conditions.used") },
  ];

  // Update SORT_OPTIONS to use translations
  const SORT_OPTIONS = [
    { id: "newest", name: t("products.filters.sort.newest"), field: "createdAt", order: "desc" },
    { id: "oldest", name: t("products.filters.sort.oldest"), field: "createdAt", order: "asc" },
    { id: "price_asc", name: t("products.filters.sort.priceAsc"), field: "price", order: "asc" },
    { id: "price_desc", name: t("products.filters.sort.priceDesc"), field: "price", order: "desc" },
  ];

  // Build filters object for the hook
  const filters = useMemo(() => {
    const filterObj = {};
    
    if (searchQuery.trim()) {
      filterObj.search_keyword = searchQuery.trim();
    }
    
    if (activeProductType && activeProductType !== 'all') {
      filterObj.type = activeProductType;
    }
    
    if (selectedGovernorate) {
      filterObj.governorate = selectedGovernorate;
    }
    
    if (selectedCity) {
      filterObj.city = selectedCity;
    }
    
    if (selectedCondition && selectedCondition !== 'all') {
      filterObj.condition = selectedCondition;
    }
    
    if (priceFrom) {
      filterObj.minPrice = parseFloat(priceFrom);
    }
    
    if (priceTo) {
      filterObj.maxPrice = parseFloat(priceTo);
    }
    
    // Add sorting
    const sortOption = SORT_OPTIONS.find(s => s.id === sortBy);
    if (sortOption) {
      filterObj.sortBy = sortOption.field;
      filterObj.sortOrder = sortOption.order;
    }
    
    return filterObj;
  }, [searchQuery, activeProductType, selectedGovernorate, selectedCity, selectedCondition, priceFrom, priceTo, sortBy]);

  // Use the products hook
  const {
    products,
    totalCount,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useProducts(filters);

  // Get available cities based on selected governorate
  const availableCities = useMemo(() => {
    if (!selectedGovernorate) return [];
    const gov = governorates.find(g => g.name === selectedGovernorate);
    return gov ? gov.cities : [];
  }, [selectedGovernorate]);

  // Reset city when governorate changes
  useEffect(() => {
    if (selectedGovernorate) {
      setSelectedCity('');
    }
  }, [selectedGovernorate]);

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ أقل من ساعة';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `منذ ${diffInWeeks} أسبوع`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `منذ ${diffInMonths} شهر`;
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveProductType('all');
    setSearchQuery('');
    setSelectedGovernorate('');
    setSelectedCity('');
    setSelectedCondition('all');
    setPriceFrom('');
    setPriceTo('');
    setSortBy('newest');
  };

  const renderGovernorateModal = () => (
    <Modal
      open={showGovernoratesModal}
      onClose={() => setShowGovernoratesModal(false)}
      sx={{
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: isMobile ? '100%' : 600,
          maxHeight: isMobile ? '80vh' : '70vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: isMobile ? '16px 16px 0 0' : '8px',
          overflow: 'hidden',
          transform: isMobile ? 'translateY(0)' : 'scale(1)',
          transition: 'transform 0.3s ease-out',
          '&:focus-visible': {
            outline: 'none',
          },
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {t('products.chooseRegion')}
          </Typography>
          <IconButton
            onClick={() => setShowGovernoratesModal(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'action.hover',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
  
        {/* Modal Content */}
        <Box
          sx={{
            p: 3,
            overflowY: 'auto',
            maxHeight: `calc(${isMobile ? '80vh' : '70vh'} - 73px)`,
          }}
        >
          <Grid container spacing={2}>
            {/* All Regions Button */}
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant={!selectedGovernorate ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedGovernorate('');
                  setSelectedCity('');
                  setShowGovernoratesModal(false);
                }}
                sx={{
                  mb: 1,
                  justifyContent: 'space-between',
                  py: 2,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: !selectedGovernorate ? 'bold' : 'normal',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: !selectedGovernorate ? 2 : 0,
                  },
                }}
              >
                {t('products.filters.all')}
                {!selectedGovernorate && <CheckIcon fontSize="small" />}
              </Button>
            </Grid>
  
            {/* Governorate Buttons */}
            {governorates.map((gov) => (
              <Grid item xs={12} sm={6} md={4} key={gov.name}>
                <Button
                  fullWidth
                  variant={selectedGovernorate === gov.name ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedGovernorate(gov.name);
                    setShowGovernoratesModal(false);
                  }}
                  sx={{
                    mb: 1,
                    justifyContent: 'space-between',
                    py: 2,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: selectedGovernorate === gov.name ? 'bold' : 'normal',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: selectedGovernorate === gov.name ? 2 : 0,
                    },
                  }}
                >
                  {gov.name}
                  {selectedGovernorate === gov.name && <CheckIcon fontSize="small" />}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
  
        {/* Mobile Bottom Safe Area */}
        {isMobile && <Box sx={{ height: 'env(safe-area-inset-bottom)' }} />}
      </Box>
    </Modal>
  );

  const renderFiltersModal = () => (
    <Modal open={showFiltersModal} onClose={() => setShowFiltersModal(false)}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        width: 500,
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        borderRadius: 2
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">تصفية النتائج</Typography>
          <IconButton onClick={() => setShowFiltersModal(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>نوع المنتج</InputLabel>
          <Select
            value={activeProductType}
            onChange={(e) => setActiveProductType(e.target.value)}
            label="نوع المنتج"
          >
            {PRODUCT_TYPES.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  {type.icon}
                  {type.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>حالة المنتج</InputLabel>
          <Select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            label="حالة المنتج"
          >
            {CONDITION_OPTIONS.map((condition) => (
              <MenuItem key={condition.id} value={condition.id}>
                {condition.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

     

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>المحافظة</InputLabel>
          <Select
            value={selectedGovernorate}
            onChange={(e) => {
              setSelectedGovernorate(e.target.value);
              setSelectedCity('');
            }}
            label="المحافظة"
          >
            <MenuItem value="">كل المحافظات</MenuItem>
            {governorates.map((gov) => (
              <MenuItem key={gov.name} value={gov.name}>{gov.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedGovernorate && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>المدينة</InputLabel>
            <Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              label="المدينة"
            >
              <MenuItem value="">كل المدن</MenuItem>
              {availableCities.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>ترتيب النتائج</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="ترتيب النتائج"
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => {
              clearFilters();
              setShowFiltersModal(false);
            }}
          >
            إعادة تعيين
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowFiltersModal(false)}
          >
            تطبيق الفلاتر
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const renderProductCard = (product) => (
    <Card sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      mb: 2, 
      '&:hover': { 
        boxShadow: 4,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      },
      transition: 'all 0.3s ease'
    }}
    // onClick={() => navigate(`/products/${product.id || product._id}`)}
    onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        sx={{ 
          width: { xs: '100%', sm: 150, md: 200 }, // Responsive width
          height: { xs: 200, sm: 150 }, // Responsive height
          flexShrink: 0,
          objectFit: 'cover'
        }}
        image={product.images?.[0] || '/placeholder-product.jpg'}
        alt={product.name}
      />
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div" fontWeight="bold" sx={{ flex: 1, color: '#2e7d32' }}>
            {product.name}
          </Typography>
          
          {/* Price */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" color="#2e7d32" fontWeight="bold">
              {product.price} {CURRENCY_SYMBOLS[product.currency] || product.currency}
            </Typography>
           
          </Box>
          
        </Box>
        

        {/* Description */}
        {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {product.description}
        </Typography> */}

        {/* Product Details */}
        <Box display="flex" flex="wrap" gap={1} mb={2}>
          <Chip 
            // icon={PRODUCT_TYPES.find(t => t.id === product.type)?.icon} 
            label={PRODUCT_TYPES.find(t => t.id === product.type)?.name || product.type} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            label={product.condition === 'New' ? 'جديد' : 'مستعمل'} 
            size="small" 
            color={product.condition === 'New' ? 'success' : 'warning'}
            variant="outlined"
          />
           {product.isNegotiable && (
              <Chip label={t("selling.negotiable")} size="small" color="info" variant="outlined" />
            )}
        </Box>

        {/* Location and Stats */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={3} color="text.secondary">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationIcon fontSize="small" />
              <Typography variant="body2">
                {product.city}, {product.governorate}
              </Typography>
            </Box>
            
            {/* <Box display="flex" alignItems="center" gap={0.5}>
              <EyeIcon fontSize="small" />
              <Typography variant="body2">{product.viewCount}</Typography>
            </Box> */}
            
            <Box display="flex" alignItems="center" gap={0.5}>
              <TimeIcon fontSize="small" />
              <Typography variant="body2">
                {formatTimeAgo(product.postedAt)}
              </Typography>
            </Box>
          </Box>

          {/* Contact Buttons */}
          <Box display="flex" gap={1}>
            {product.contactInfo?.whatsapp && (
              <IconButton 
                size="small" 
                color="success"
                onClick={() => window.open(`https://wa.me/${product.contactInfo.whatsapp.replace(/[^\d]/g, '')}`, '_blank')}
              >
                <WhatsAppIcon />
              </IconButton>
            )}
            {/* {product.contactInfo?.phone && (
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => window.open(`tel:${product.contactInfo.phone}`, '_blank')}
              >
                <PhoneIcon />
              </IconButton>
            )} */}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderProductSkeleton = () => (
    <Card sx={{ display: 'flex', mb: 2 }}>
      <Skeleton variant="rectangular" width={200} height={150} />
      <CardContent sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="80%" />
        <Box display="flex" gap={1} mt={1}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
   

      {/* Search Section */}
      <Paper sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'grey.200' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2}>
            {/* Search Bar */}
            <Box sx={{ flex: 1, position: 'relative' }}>
              <TextField
                fullWidth
               placeholder={t("products.filters.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    pr: 1,
                    pl: 4,
                    py: 0.5
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Location and Filter */}
            <Box display="flex" gap={1}>
              <Button 
                variant="outlined" 
                startIcon={<LocationIcon />}
                endIcon={<ExpandMoreIcon />}
                onClick={() => setShowGovernoratesModal(true)}
                sx={{ minWidth: 150 }}
              >
                {selectedGovernorate || t("products.filters.all")}
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFiltersModal(true)}
              >
               {t("products.filters.title")}
              </Button>
            </Box>
          </Box>

          {/* Active Filters */}
          {(activeProductType !== 'all' || selectedGovernorate || selectedCondition !== 'all' || searchQuery) && (
            <Box display="flex" gap={1} mt={2} flexWrap="wrap" alignItems="center">
              {/* <Typography variant="body2" color="text.secondary">المرشحات النشطة:</Typography> */}
              <Typography variant="body2" color="text.secondary">
                {t("products.filters.activeFilters")}:
              </Typography>
              {searchQuery && (
                <Chip 
                label={`${t("products.filters.search")}: ${searchQuery}`}
                  onDelete={() => setSearchQuery('')}
                  size="small"
                />
              )}
              
              {activeProductType !== 'all' && (
                <Chip 
                  label={PRODUCT_TYPES.find(t => t.id === activeProductType)?.name}
                  onDelete={() => setActiveProductType('all')}
                  size="small"
                />
              )}
              
              {selectedGovernorate && (
                <Chip 
                  label={selectedGovernorate}
                  onDelete={() => {
                    setSelectedGovernorate('');
                    setSelectedCity('');
                  }}
                  size="small"
                />
              )}
              
              {selectedCondition !== 'all' && (
                <Chip 
                  label={CONDITION_OPTIONS.find(c => c.id === selectedCondition)?.name}
                  onDelete={() => setSelectedCondition('all')}
                  size="small"
                />
              )}
              
              <Button 
                size="small" 
                startIcon={<RefreshIcon />}
                onClick={clearFilters}
              >
                مسح الكل
              </Button>
            </Box>
          )}
          {/* Mobile Categories */}
{isMobile && (
  <Box sx={{ mt: 2, overflowX: 'auto', whiteSpace: 'nowrap', py: 1 }}>
    <Box display="flex" gap={1}>
      {PRODUCT_TYPES.map((type) => (
        <Chip
          key={type.id}
          icon={type.icon}
          label={type.name}
          onClick={() => setActiveProductType(type.id)}
          variant={activeProductType === type.id ? 'filled' : 'outlined'}
          color={activeProductType === type.id ? 'primary' : 'default'}
          sx={{
            px: 1,
            '& .MuiChip-icon': {
              ml: i18n.language === 'ar' ? 0 : undefined,
              mr: i18n.language === 'ar' ? 0.5 : undefined
            }
          }}
        />
      ))}
    </Box>
  </Box>
)}
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
        <Box display="flex" gap={3}>
          {/* Left Sidebar - Categories */}
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("products.filters.category")}
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {PRODUCT_TYPES.map((type) => (
                    <Button
                      key={type.id}
                      fullWidth
                      startIcon={type.icon}
                      onClick={() => setActiveProductType(type.id)}
                      sx={{
                        justifyContent: 'flex-start',
                        bgcolor: activeProductType === type.id ? '#1877f2' : 'grey.50',
                        color: activeProductType === type.id ? 'white' : 'text.primary',
                        textAlign: i18n.language === 'ar' ? 'right' : 'left',
                        py: 1.5,
                        // Add these new styles:
                        '& .MuiButton-startIcon': {
                          marginRight: i18n.language === 'ar' ? 0 : '8px',
                          marginLeft: i18n.language === 'ar' ? '8px' : 0,
                        }
                      }}
                    >
                      {type.name}
                    </Button>
                  ))}
                </Box>
              </Paper>

              {/* Quick Stats */}
              {/* <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t("common.stats")}
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    {t("products.totalProducts")}: {totalCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("products.displayed")}: {products.length}
                  </Typography>
                </Box>
              </Paper> */}
            </Box>
          )}

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1 }}>
            {/* Results Header */}
            <Paper sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom={1} borderColor="grey.100">
              <Typography variant="h6">
                  {t("calculator.results")} ({totalCount})
                </Typography>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                  >
                    {SORT_OPTIONS.map((option) => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Products List */}
              <Box p={2}>
                {isLoading && products.length === 0 ? (
                  // Initial loading skeletons
                  <>
                    {[...Array(5)].map((_, i) => (
                      <div key={i}>
                        {renderProductSkeleton()}
                      </div>
                    ))}
                  </>
                ) : isError ? (
                  <Box textAlign="center" py={8} color="error.main">
                    <ErrorIcon fontSize="large" />
                    <Typography variant="h6" mt={2}>
                      {t("products.error")}
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      {error?.message || 'تحقق من اتصال الإنترنت وأعد المحاولة'}
                    </Typography>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}>
                      أعد المحاولة
                    </Button>
                  </Box>
                ) : (
                  <>
                    {/* Products */}
                    {products.map((product) => (
                      <div key={product.id || product._id}>
                        {renderProductCard(product)}
                      </div>
                    ))}

                    {/* Load More Button */}
                    {hasNextPage && (
                      <Box textAlign="center" mt={3}>
                        <Button
                          variant="outlined"
                          onClick={handleLoadMore}
                          disabled={isFetchingNextPage}
                          startIcon={isFetchingNextPage ? <CircularProgress size={20} /> : null}
                        >
                          {isFetchingNextPage ? 'جاري التحميل...' : 'تحميل المزيد'}
                        </Button>
                      </Box>
                    )}

                    {/* No Results */}
                    {products.length === 0 && !isLoading && (
                      <Box textAlign="center" py={12} color="text.secondary">
                        <Typography variant="h4" mb={2}>🔍</Typography>
                        <Typography variant="h6" mb={1}>
                          لا توجد منتجات متطابقة مع بحثك
                        </Typography>
                        <Typography variant="body2" mb={3}>
                          جرب تغيير كلمات البحث أو الفلاتر للعثور على منتجات أخرى
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<RefreshIcon />}
                          onClick={clearFilters}
                        >
                          مسح جميع المرشحات
                        </Button>
                      </Box>
                    )}

                    {/* Loading more indicator */}
                    {isFetchingNextPage && (
                      <Box textAlign="center" py={4}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          جاري تحميل المزيد من المنتجات...
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Modals */}
      {renderGovernorateModal()}
      {renderFiltersModal()}

      {/* Mobile Filter FAB */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <Button
            variant="contained"
            startIcon={<FilterIcon />}
            onClick={() => setShowFiltersModal(true)}
            sx={{
              borderRadius: 8,
              px: 3,
              py: 1.5,
              fontSize: 16,
              boxShadow: 4
            }}
          >
            فلتر
          </Button>
        </Box>
      )}
    </Box>
  );
}