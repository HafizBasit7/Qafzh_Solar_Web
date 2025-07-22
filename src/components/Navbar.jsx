import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SolarPower,
  Engineering,
  Store,
  Calculate,
  Language,
  Add,
} from "@mui/icons-material";
import SellingForm from "./SellingForm";

const Navbar = ({ language, onLanguageToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [sellingFormOpen, setSellingFormOpen] = useState(false);

  const navItems = [
    { text: t("nav.products"), path: "/products", icon: <Store /> },
    { text: t("nav.engineers"), path: "/engineers", icon: <Engineering /> },
    { text: t("nav.shops"), path: "/shops", icon: <Store /> },
    { text: t("nav.shopAds"), path: "/shop-ads", icon: <Store /> },
    { text: t("nav.calculator"), path: "/calculator", icon: <Calculate /> },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#2e7d32" }}>
        <Toolbar
          sx={{
            maxWidth: "1400px",
            mx: "auto",
            width: "100%",
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <SolarPower sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {t("nav.brand")}
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: { xs: 1, md: 2 },
              mx: { xs: 2, md: 4 },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  px: { xs: 1, md: 2 },
                  "& .MuiButton-startIcon": {
                    mr: { xs: 0.5, md: 1 },
                    ml: { xs: 0.5, md: 1 },
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Start Selling Button */}
            <Button
              key={language}
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSellingFormOpen(true)}
              sx={{
                backgroundColor: "#ff6f00",
                color: "white",
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 8px rgba(255, 111, 0, 0.3)",
                "&:hover": {
                  backgroundColor: "#e65100",
                  boxShadow: "0 6px 12px rgba(255, 111, 0, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {t("nav.startSelling")}
            </Button>

            {/* Language Toggle */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "inherit",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={onLanguageToggle}
            >
              <Language />
              <Typography variant="caption" sx={{ ml: 1, fontWeight: "bold" }}>
                {language === "ar" ? "EN" : "عربي"}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Selling Form Dialog */}
      <SellingForm
        open={sellingFormOpen}
        onClose={() => setSellingFormOpen(false)}
      />
    </>
  );
};

export default Navbar;
