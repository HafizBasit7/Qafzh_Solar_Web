import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SolarPower, Engineering, Store, Calculate } from "@mui/icons-material";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    {
      title: t("home.categories.solar.title"),
      subtitle: t("home.categories.solar.subtitle"),
      description: t("home.categories.solar.description"),
      icon: <SolarPower sx={{ fontSize: 60, color: "#2e7d32" }} />,
      path: "/products",
      color: "#e8f5e9",
    },
    {
      title: t("home.categories.engineers.title"),
      subtitle: t("home.categories.engineers.subtitle"),
      description: t("home.categories.engineers.description"),
      icon: <Engineering sx={{ fontSize: 60, color: "#2e7d32" }} />,
      path: "/engineers",
      color: "#f3e5f5",
    },
    {
      title: t("home.categories.shops.title"),
      subtitle: t("home.categories.shops.subtitle"),
      description: t("home.categories.shops.description"),
      icon: <Store sx={{ fontSize: 60, color: "#2e7d32" }} />,
      path: "/shops",
      color: "#fff3e0",
    },
  ];

  return (
    <Box width="100vw" sx={{ overflowX: "hidden" }}>
      {/* Hero Section */}
      <Paper
        sx={{
          background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
          color: "white",
          py: { xs: 6, md: 8, lg: 10 },
          textAlign: "center",
          width: "100vw",
          borderRadius: 0,
        }}
      >
        <Box width="100%">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
            }}
          >
            {t("home.hero.title")}
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 4,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            {t("home.hero.subtitle")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: { xs: "1rem", md: "1.1rem" },
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            {t("home.hero.description")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Calculate />}
            onClick={() => navigate("/calculator")}
            sx={{
              backgroundColor: "#ff6f00",
              "&:hover": { backgroundColor: "#e65100" },
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            {t("home.hero.calculator")}
          </Button>
        </Box>
      </Paper>

      {/* Categories Section */}
      <Box width="100%" sx={{ py: { xs: 6, md: 8, lg: 10 } }}>
        <Box maxWidth={1400} mx="auto">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              mb: { xs: 4, md: 6 },
              fontWeight: "bold",
              fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
            }}
          >
            {t("home.services.title")}
          </Typography>

          <Grid
            container
            spacing={{ xs: 3, md: 4, lg: 5 }}
            justifyContent="center"
          >
            {categories.map((category, index) => (
              <Grid item xs={12} md={4} key={index} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    width: "100%",
                    minWidth: 300,
                    maxWidth: 370,
                    height: { xs: 340, md: 370 },
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "stretch",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(category.path)}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: { xs: 3, md: 4 },
                      backgroundColor: category.color,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Box sx={{ mb: 2 }}>{category.icon}</Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "1.3rem", md: "1.5rem" },
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
                      >
                        {category.subtitle}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                      >
                        {category.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 3,
                        borderColor: "#2e7d32",
                        color: "#2e7d32",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {t("home.explore")}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Features Section */}
      <Paper
        sx={{
          backgroundColor: "#f5f5f5",
          py: { xs: 6, md: 8 },
          width: "100vw",
          borderRadius: 0,
        }}
      >
        <Box width="100%">
          <Box maxWidth={1400} mx="auto">
            <Typography
              variant="h4"
              textAlign="center"
              gutterBottom
              sx={{
                mb: { xs: 4, md: 6 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", md: "2.2rem", lg: "2.5rem" },
              }}
            >
              {t("home.why.title")}
            </Typography>
            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                    }}
                  >
                    {t("home.why.products.title")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {t("home.why.products.description")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                    }}
                  >
                    {t("home.why.engineers.title")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {t("home.why.engineers.description")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                    }}
                  >
                    {t("home.why.service.title")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                  >
                    {t("home.why.service.description")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;
