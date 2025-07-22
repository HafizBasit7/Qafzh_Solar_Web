import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import StoreIcon from "@mui/icons-material/Store";

const shopAds = [
  {
    id: 1,
    title: "خصم خاص على الألواح الشمسية",
    description:
      "احصل على خصم 20% على جميع الألواح الشمسية من محل الطاقة المتجددة حتى نهاية الشهر.",
    shop: "محل الطاقة المتجددة",
    date: "2024-06-01",
  },
  {
    id: 2,
    title: "بطاريات ليثيوم بسعر خاص",
    description:
      "بطاريات ليثيوم عالية الجودة متوفرة الآن بسعر خاص لفترة محدودة.",
    shop: "مركز الطاقة الخضراء",
    date: "2024-06-03",
  },
];

const ShopAdsPage = () => {
  const { t } = useTranslation();
  return (
    <Box width="100vw" sx={{ py: { xs: 4, md: 6 }, background: "#f5f5f5" }}>
      <Box maxWidth={900} mx="auto">
        <Typography variant="h3" textAlign="center" fontWeight="bold" mb={4}>
          {t("nav.shopAds")}
        </Typography>
        <Grid container spacing={3}>
          {shopAds.map((ad) => (
            <Grid item xs={12} key={ad.id}>
              <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <StoreIcon
                  sx={{ fontSize: 48, color: "primary.main", mr: 3 }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold" mb={1}>
                    {ad.title}
                  </Typography>
                  <Typography variant="body1" mb={1}>
                    {ad.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ad.shop} - {ad.date}
                  </Typography>
                </CardContent>
                {/* Placeholder for admin add/edit/delete */}
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="primary" disabled>
            {t("common.addAd", "إضافة إعلان جديد (للمشرف)")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShopAdsPage;
