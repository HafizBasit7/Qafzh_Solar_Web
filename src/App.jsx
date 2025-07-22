import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./i18n";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import EngineersPage from "./pages/EngineersPage";
import ShopsPage from "./pages/ShopsPage";
import ProductDetail from "./pages/ProductDetail";
import EngineerDetail from "./pages/EngineerDetail";
import ShopDetail from "./pages/ShopDetail";
import SolarCalculator from "./SolarCalculator";
import ShopAdsPage from "./pages/ShopAdsPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green color for solar theme
    },
    secondary: {
      main: "#ff6f00", // Orange accent
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1920px)": {
            maxWidth: "1400px",
          },
        },
      },
    },
  },
});

function App() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    document.body.setAttribute("lang", language);
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#fafafa",
            direction: language === "ar" ? "rtl" : "ltr",
          }}
        >
          <Navbar language={language} onLanguageToggle={toggleLanguage} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/engineers" element={<EngineersPage />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/engineer/:id" element={<EngineerDetail />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/calculator" element={<SolarCalculator />} />
            <Route path="/shop-ads" element={<ShopAdsPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
