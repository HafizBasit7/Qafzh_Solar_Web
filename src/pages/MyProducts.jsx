import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Add,
  ArrowBack,
  Delete,
  Inventory,
  CheckCircle,
  Pending,
} from "@mui/icons-material";
import { useAuthContext } from "../contexts/AuthContext";
import { useProducts } from "../hooks/useProducts";
import { useDialogContext } from "../contexts/DialogContext";
import SellingForm from "../components/SellingForm";

const MyProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuthContext();
  const { showConfirm, showSuccess, showError } = useDialogContext();
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [openSellingForm, setOpenSellingForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const {
    products,
    isLoading,
    isError,
    error,
    refetch,
    deleteProduct,
  } = useProducts({ user_products: true });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      setDeletingId(productToDelete);
      await deleteProduct(productToDelete);
      showSuccess(t("product.deleteSuccess"));
      refetch(); // Refresh the product list after deletion
    } catch (error) {
      showError(t("product.deleteError"));
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  if (isLoading && !refreshing) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error.message}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => refetch()}>
          {t("common.retry")}
        </Button>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold" }}>
            {t("products.myProducts")}
          </Typography>
        </Box>
        <Inventory sx={{ fontSize: 80, color: "text.disabled", my: 3 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("products.noProducts")}
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenSellingForm(true)}
          sx={{
            backgroundColor: "#22C55E",
            "&:hover": { backgroundColor: "#1a9c4a" },
          }}
        >
          {t("products.addFirstProduct")}
        </Button>
        <SellingForm
          open={openSellingForm}
          onClose={() => setOpenSellingForm(false)}
          onSuccess={() => {
            setOpenSellingForm(false);
            refetch();
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "white",
          p: 2,
          borderBottom: "1px solid #EDF2F7",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                ml: 1,
                fontWeight: "bold",
                color: "#1E293B",
                fontSize: isMobile ? "1.25rem" : "1.5rem",
              }}
            >
              {t("products.myProducts")}
              <Typography
                component="span"
                sx={{
                  color: "#64748B",
                  fontWeight: "medium",
                  ml: 1,
                  fontSize: isMobile ? "0.875rem" : "1rem",
                }}
              >
                ({products.length})
              </Typography>
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                ml: "auto",
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#1a9c4a" },
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
              onClick={() => setOpenSellingForm(true)}
            >
              {t("products.addProduct")}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Product Grid */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={isMobile ? 1 : 2}>
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  position: "relative",
                  "&:hover": {
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height={isMobile ? 140 : 180}
                  image={product.images[0] || "/placeholder-product.jpg"}
                  alt={product.title}
                  onClick={() => handleProductClick(product)}
                  sx={{
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                />
                
                {/* Status Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    backgroundColor:
                      product.status === "approved" ? "#10B981" : "#F59E0B",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {product.status === "approved" ? (
                    <CheckCircle sx={{ fontSize: "1rem", mr: 0.5 }} />
                  ) : (
                    <Pending sx={{ fontSize: "1rem", mr: 0.5 }} />
                  )}
                  {product.status === "approved"
                    ? t("products.approved")
                    : t("products.pending")}
                </Box>
                
                {/* Delete Button */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#DC2626",
                    },
                    width: 32,
                    height: 32,
                  }}
                  onClick={() => handleDeleteClick(product._id)}
                  disabled={deletingId === product._id}
                >
                  {deletingId === product._id ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <Delete sx={{ fontSize: "1rem" }} />
                  )}
                </IconButton>

                <CardContent sx={{ flexGrow: 1, p: isMobile ? 1 : 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      mb: 0.5,
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      mb: 1,
                    }}
                  >
                    {product.description.substring(0, 60)}...
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#1E293B",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("products.deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <Typography>{t("products.deleteConfirmMessage")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<Delete />}
            disabled={deletingId === productToDelete}
          >
            {deletingId === productToDelete ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              t("common.delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <SellingForm
        open={openSellingForm}
        onClose={() => setOpenSellingForm(false)}
        onSuccess={() => {
          setOpenSellingForm(false);
          refetch();
        }}
      />
    </Box>
  );
};

export default MyProducts;