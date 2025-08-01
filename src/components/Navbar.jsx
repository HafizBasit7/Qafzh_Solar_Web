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
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  CircularProgress,
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
  Menu as MenuIcon,
  AccountCircle,
  Edit,
  VerifiedUser,
  Phone,
  Logout,
  Inventory,
} from "@mui/icons-material";
import { useAuthContext } from "../contexts/AuthContext";
import { useDialogContext } from "../contexts/DialogContext";
import SellingForm from "./SellingForm";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const Navbar = ({ language, onLanguageToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const { showSuccess } = useDialogContext();
  const [sellingFormOpen, setSellingFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

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

  const handleProfileMenuOpen = (event) => {
    if (!isAuthenticated) {
      // Instead of navigating to login page, open the LoginModal
      setLoginModalOpen(true); // You'll need to pass this from your parent component
      return;
    }
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
    handleProfileMenuClose();
  };

  const handleLogoutConfirm = async () => {
    await logout();
    showSuccess(t("auth.logoutSuccess"), t("auth.comeBackSoon"));
    setLogoutConfirmOpen(false);
    navigate("/"); // Redirect to home after logout
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
    handleProfileMenuClose();
  };

  const handleMyProducts = () => {
    navigate("/my-products");
    handleProfileMenuClose();
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

        {isAuthenticated && (
          <>
            <ListItem
              button
              onClick={() => {
                navigate("/update-profile");
                setMobileMenuOpen(false);
              }}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Edit />
              </ListItemIcon>
              <ListItemText primary={t("profile.updateProfile")} />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                navigate("/my-products");
                setMobileMenuOpen(false);
              }}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Inventory />
              </ListItemIcon>
              <ListItemText primary={t("profile.myProducts")} />
            </ListItem>
          </>
        )}

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

        {isAuthenticated && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            onClick={() => {
              setLogoutConfirmOpen(true);
              setMobileMenuOpen(false);
            }}
            sx={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              mb: 2,
            }}
          >
            {t("profile.logout")}
          </Button>
        )}

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
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {t("nav.brand")}
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && renderDesktopNav()}

          {/* Desktop Actions */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Start Selling Button */}
              <Button
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

              {/* Profile Menu */}
              <IconButton
                size="large"
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {user?.profileImageUrl ? (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      user?.isVerified ? (
                        <VerifiedUser
                          fontSize="small"
                          sx={{ color: "#4caf50", backgroundColor: "white", borderRadius: "50%" }}
                        />
                      ) : null
                    }
                  >
                    <Avatar
                      src={user?.profileImageUrl}
                      alt={user?.name}
                      sx={{ width: 36, height: 36 }}
                    />
                  </Badge>
                ) : (
                  <AccountCircle sx={{ fontSize: 32 }} />
                )}
              </IconButton>

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
          )}

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: "auto" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name || user?.phone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.phone}
          </Typography>
          {user?.isVerified && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <VerifiedUser fontSize="small" color="success" />
              <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                Verified User
              </Typography>
            </Box>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleUpdateProfile}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Update Profile
        </MenuItem>
        <MenuItem onClick={handleMyProducts}>
          <ListItemIcon>
            <Inventory fontSize="small" />
          </ListItemIcon>
          My Products
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Navigation Drawer */}
      {renderMobileNav()}

      {/* Selling Form Dialog */}
      <SellingForm
        open={sellingFormOpen}
        onClose={() => setSellingFormOpen(false)}
      />

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

        {/* Login Modal */}
        <LoginModal
  open={loginModalOpen && !isAuthenticated}
  onClose={() => setLoginModalOpen(false)}
  onSuccess={() => {
    setLoginModalOpen(false);
  }}
  onOpenSignup={() => {
    setLoginModalOpen(false);      // close login modal
    setSignupModalOpen(true);      // open signup modal
  }}
/>

<SignupModal
  open={signupModalOpen}
  onClose={() => setSignupModalOpen(false)}
/>
    </>
  );
};

export default Navbar;