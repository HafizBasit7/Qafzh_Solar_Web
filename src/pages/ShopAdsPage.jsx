import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useAds } from "../hooks/useAds";

const ShopAdsPage = () => {
  const { t } = useTranslation();
  const { useAdsQuery } = useAds();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useAdsQuery({ limit: 10 });
  const ads = data?.pages?.flatMap(page => page.data) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>;
  }

  if (isError) {
    return <Alert severity="error" sx={{ my: 2 }}>{error?.message || t('ads.loadError')}</Alert>;
  }

  return (
    <Box width="100%" sx={{ py: { xs: 4, md: 6 }, background: "#f5f5f5" }}>
      <Box maxWidth={1200} mx="auto" px={2}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" mb={4}>
          {t("nav.shopAds")}
        </Typography>
        
        {ads.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">{t('ads.noneFound')}</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {ads.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}>
                  {ad.imageUrl && (
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                      image={ad.imageUrl}
                      alt={ad.title}
                    />
                  )}
                  <CardContent sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    <Typography variant="h6" fontWeight="bold" mb={1} noWrap>
                      {ad.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2} sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {ad.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Stack direction="row" spacing={1} mb={2}>
                        <Chip 
                          label={ad.active ? t('ads.active') : t('ads.inactive')} 
                          size="small"
                          color={ad.active ? 'success' : 'default'}
                        />
                      </Stack>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                    {ad.phone && (
                      <Button 
                        variant="contained" 
                        startIcon={<PhoneIcon />}
                        onClick={() => window.location.href = `tel:${ad.phone}`}
                        sx={{ flex: 1 }}
                      >
                        {t('ads.call')}
                      </Button>
                    )}
                    {ad.link && (
                      <Button 
                        variant="outlined" 
                        startIcon={<OpenInNewIcon />}
                        onClick={() => window.open(ad.link, '_blank')}
                        sx={{ flex: 1 }}
                      >
                        {t('ads.open')}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ShopAdsPage;