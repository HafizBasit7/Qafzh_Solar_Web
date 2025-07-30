import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
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
  Menu,
} from "@mui/icons-material";
import { useAuthContext } from "../contexts/AuthContext";
import { useDialogContext } from "../contexts/DialogContext";
import SellingForm from "./SellingForm";

const Navbar = ({ language, onLanguageToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const { showSuccess } = useDialogContext();
  const [sellingFormOpen, setSellingFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navItems = [
    { text: t("nav.products"), path: "/products", icon: <Store /> },
    { text: t("nav.engineers"), path: "/engineers", icon: <Engineering /> },
    { text: t("nav.shops"), path: "/shops", icon: <Store /> },
    { text: t("nav.shopAds"), path: "/shop-ads", icon: <Store /> },
    { text: t("nav.calculator"), path: "/calculator", icon: <Calculate /> },
  ];

  const handleNavItemClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleStartSellingClick = () => {
    setSellingFormOpen(true);
    setMobileMenuOpen(false);
  };
  
  const handleLogout = async () => {
    await logout();
    showSuccess(t("auth.logoutSuccess"), t("auth.comeBackSoon"));
  };

  const renderDesktopNav = () => (
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
  );

  const renderMobileNav = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: "#2e7d32",
          color: "white",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SolarPower sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {t("nav.brand")}
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", mb: 2 }} />

        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              button
              onClick={() => handleNavItemClick(item.path)}
              sx={{
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                borderRadius: 1,
                mb: 1,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />

        <Button
          fullWidth
          variant="contained"
          startIcon={<Add />}
          onClick={handleStartSellingClick}
          sx={{
            backgroundColor: "#ff6f00",
            color: "white",
            fontWeight: "bold",
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(255, 111, 0, 0.3)",
            "&:hover": {
              backgroundColor: "#e65100",
              boxShadow: "0 6px 12px rgba(255, 111, 0, 0.4)",
            },
            mb: 2,
          }}
        >
          {t("nav.startSelling")}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Language />}
          onClick={() => {
            onLanguageToggle();
            setMobileMenuOpen(false);
          }}
          sx={{
            borderColor: "rgba(255,255,255,0.3)",
            color: "white",
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          {language === "ar" ? "EN" : "عربي"}
        </Button>
      </Box>
    </Drawer>
  );

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

          {/* Desktop Navigation */}
          {!isMobile && renderDesktopNav()}

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: "auto" }}
            >
              <Menu />
            </IconButton>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
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
                <Typography
                  variant="caption"
                  sx={{ ml: 1, fontWeight: "bold" }}
                >
                  {language === "ar" ? "EN" : "عربي"}
                </Typography>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      {renderMobileNav()}

      {/* Selling Form Dialog */}
      <SellingForm
        open={sellingFormOpen}
        onClose={() => setSellingFormOpen(false)}
      />
    </>
  );
};

export default Navbar;
