
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
  Storefront,
  LocalOffer,
  Home
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
  const { isAuthenticated, userData: user, logout } = useAuthContext();
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
    { text: t("nav.home"), path: "/", icon: <Home /> },               // Arabic: "الرئيسية"
    { text: t("nav.engineers"), path: "/engineers", icon: <Engineering /> },
    { text: t("nav.shops"), path: "/shops", icon: <Storefront /> },  // Different from home
    { text: t("nav.shopAds"), path: "/shop-ads", icon: <LocalOffer /> }, // Or <AdUnits />
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
          backgroundColor: "#1877f2",
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

        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", mb: 2 }} />

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
            backgroundColor: "#2e7d32",
            color: "white",
            fontWeight: "bold",
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 4px 8px #2e7d32",
            "&:hover": {
              backgroundColor: "#2e7d32",
              boxShadow: "0 6px 12px #2e7d32",
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
      <AppBar position="static" sx={{ backgroundColor: "#1877f2" }}>
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
                  backgroundColor: "#2e7d32",
                  color: "white",
                  fontWeight: "bold",
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 4px 8px #2e7d32",
                  "&:hover": {
                    backgroundColor: "#2e9d32",
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

      {/* Enhanced Profile Menu */}
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
            minWidth: 280,
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
        {/* Enhanced User Profile Header */}
        <Box 
          sx={{ 
            px: 3, 
            py: 2.5, 
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 2,
            minHeight: 80
          }}
        >
          {/* Profile Image */}
          <Box sx={{ position: "relative" }}>
            {user?.profileImageUrl || user?.profileImage ? (
              <Avatar
                src={user?.profileImageUrl || user?.profileImage}
                alt={user?.name || user?.phone || user?.phoneNumber}
                sx={{ 
                  width: 56, 
                  height: 56,
                  border: "2px solid",
                  borderColor: "primary.main"
                }}
              />
            ) : (
              <Avatar
                sx={{ 
                  width: 56, 
                  height: 56,
                  bgcolor: "primary.main",
                  border: "2px solid",
                  borderColor: "primary.main",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 
                 user?.phone ? user.phone.slice(-2) :
                 user?.phoneNumber ? user.phoneNumber.slice(-2) : "U"}
              </Avatar>
            )}
            {/* Verification Badge */}
            {(user?.isVerified || user?.verified) && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  backgroundColor: "success.main",
                  borderRadius: "50%",
                  p: 0.3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid white"
                }}
              >
                <VerifiedUser 
                  sx={{ 
                    fontSize: 16, 
                    color: "white" 
                  }} 
                />
              </Box>
            )}
          </Box>

          {/* User Information */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {user?.name || user?.fullName || user?.username || "User"}
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Phone sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {user?.phone || user?.phoneNumber || user?.mobile || "No phone available"}
              </Typography>
            </Box>

            {/* Debug Info - Remove this in production */}
            {/* {process.env.NODE_ENV === 'development' && (
              <Typography variant="caption" color="text.disabled">
                Debug: {JSON.stringify(Object.keys(user || {})).slice(0, 50)}...
              </Typography>
            )} */}

            {(user?.isVerified || user?.verified) && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <VerifiedUser 
                  sx={{ 
                    fontSize: 14, 
                    mr: 0.5, 
                    color: "success.main" 
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color="success.main" 
                  fontWeight="medium"
                >
                  Verified User
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={handleUpdateProfile}
          sx={{ 
            py: 1.5, 
            px: 3,
            "&:hover": {
              backgroundColor: "action.hover"
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Update Profile"
            primaryTypographyProps={{
              fontWeight: "medium"
            }}
          />
        </MenuItem>

        <MenuItem 
          onClick={handleMyProducts}
          sx={{ 
            py: 1.5, 
            px: 3,
            "&:hover": {
              backgroundColor: "action.hover"
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Inventory fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="My Products"
            primaryTypographyProps={{
              fontWeight: "medium"
            }}
          />
        </MenuItem>

        <Divider sx={{ mx: 2, my: 1 }} />

        <MenuItem 
          onClick={handleLogoutClick}
          sx={{ 
            py: 1.5, 
            px: 3,
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.light",
              color: "error.dark"
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Logout fontSize="small" color="inherit" />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: "medium"
            }}
          />
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