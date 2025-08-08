import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FilterList,
  LocationOn,
  Work,
  CheckCircle,
} from "@mui/icons-material";
import { useEngineers } from "../hooks/useEngineers";

const EngineersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  // const [selectedRating, setSelectedRating] = useState("");

  // Use the engineers hook
  const { engineers, isLoading, isError, error } = useEngineers({
    search_keyword: searchTerm,
    governorate: selectedLocation,
    // You can add more filters here based on your API
  });

  const locations = ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت"];
  const experienceLevels = [
    "1-3 سنوات",
    "3-5 سنوات",
    "5-10 سنوات",
    "10+ سنوات",
  ];

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">
          {error?.message || "حدث خطأ أثناء جلب بيانات المهندسين"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
      >
        المهندسين المعتمدين
      </Typography>

      {/* Filters Section */}
      {/* <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">الفلاتر</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="البحث"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: "1rem" }}>الموقع</InputLabel>
              <Select
                value={selectedLocation}
                label="الموقع"
                onChange={(e) => setSelectedLocation(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "1rem" }}>
                  الكل
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem
                    key={location}
                    value={location}
                    sx={{ fontSize: "1rem" }}
                  >
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ minWidth: 160 }}>
              <InputLabel sx={{ fontSize: "1rem" }}>الخبرة</InputLabel>
              <Select
                value={selectedExperience}
                label="الخبرة"
                onChange={(e) => setSelectedExperience(e.target.value)}
                sx={{ fontSize: "1rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "1rem" }}>
                  الكل
                </MenuItem>
                {experienceLevels.map((level) => (
                  <MenuItem key={level} value={level} sx={{ fontSize: "1rem" }}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper> */}

      {/* Engineers Grid */}
      <Grid container spacing={3}>
        {engineers?.map((engineer) => (
          <Grid item xs={12} sm={6} md={4} key={engineer._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/engineer/${engineer._id}`)}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Avatar
                  src={engineer.profileImageUrl}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {engineer.name}
                  </Typography>
                  {engineer.isVerified && (
                    <CheckCircle color="primary" sx={{ ml: 1 }} />
                  )}
                </Box>
               
              </Box>

              <Divider />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ textAlign: "right" }}
                >
                  {engineer.experience?.description?.length > 40
                    ? engineer.experience.description.substring(0, 40) + "..."
                    : engineer.experience?.description || "لا يوجد وصف"}
                </Typography>
                {engineer.experience?.description?.length > 40 && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/engineer/${engineer._id}`);
                    }}
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      textTransform: "none",
                      color: "primary.main",
                      alignSelf: "flex-end",
                    }}
                  >
                    عرض المزيد
                  </Button>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <LocationOn
                    sx={{ fontSize: 16, ml: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {engineer.city}, {engineer.governorate}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <Work sx={{ fontSize: 16, ml: 1, color: "text.secondary" }} />
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {engineer.experience?.years} سنوات خبرة
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="body2" sx={{ textAlign: "right" }}>
                    {engineer.pricing?.hourlyRate} {engineer.pricing?.currency}/ساعة
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  {engineer.services?.slice(0, 2).map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {engineer.specializations?.slice(0, 2).map((spec, index) => (
                    <Chip
                      key={`spec-${index}`}
                      label={spec}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary" fullWidth sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                  عرض الملف الشخصي
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {engineers?.length === 0 && ( 
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            لم يتم العثور على مهندسين يطابقون معايير البحث
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default EngineersPage;