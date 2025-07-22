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
  Rating,
  Avatar,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FilterList,
  LocationOn,
  Work,
  Phone,
  Email,
} from "@mui/icons-material";

const EngineersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedRating, setSelectedRating] = useState("");

  // Sample engineer data
  const engineers = [
    {
      id: 1,
      name: "أحمد محمد علي",
      location: "صنعاء",
      experience: "5-10 سنوات",
      projects: 45,
      phone: "+967 777 123 456",
      email: "ahmed@example.com",
      image: "https://via.placeholder.com/200x200/4caf50/ffffff?text=Engineer",
      specialties: ["تركيب الأنظمة الشمسية", "صيانة المحولات"],
      description:
        "مهندس معتمد في مجال الطاقة الشمسية مع خبرة 8 سنوات في تركيب وصيانة الأنظمة الشمسية. متخصص في تصميم الأنظمة المنزلية والتجارية مع التركيز على الكفاءة والموثوقية. حاصل على شهادات معتمدة من كبرى الشركات العالمية في مجال الطاقة المتجددة.",
    },
    {
      id: 2,
      name: "فاطمة عبدالله",
      location: "عدن",
      experience: "3-5 سنوات",
      projects: 32,
      phone: "+967 777 234 567",
      email: "fatima@example.com",
      image: "https://via.placeholder.com/200x200/2196f3/ffffff?text=Engineer",
      specialties: ["تصميم الأنظمة", "حسابات الطاقة"],
      description: "مهندسة متخصصة في تصميم الأنظمة الشمسية للمنازل",
    },
    {
      id: 3,
      name: "محمد سالم",
      location: "تعز",
      experience: "10+ سنوات",
      projects: 78,
      phone: "+967 777 345 678",
      email: "mohammed@example.com",
      image: "https://via.placeholder.com/200x200/ff9800/ffffff?text=Engineer",
      specialties: ["الأنظمة الصناعية", "استشارات الطاقة"],
      description: "مهندس خبير في الأنظمة الشمسية الصناعية والتجارية",
    },
    {
      id: 4,
      name: "علي حسن",
      location: "الحديدة",
      experience: "1-3 سنوات",
      projects: 18,
      phone: "+967 777 456 789",
      email: "ali@example.com",
      image: "https://via.placeholder.com/200x200/9c27b0/ffffff?text=Engineer",
      specialties: ["تركيب الألواح", "صيانة البطاريات"],
      description: "مهندس شاب متخصص في تركيب وصيانة الأنظمة المنزلية",
    },
    {
      id: 5,
      name: "سارة أحمد",
      location: "صنعاء",
      experience: "5-10 سنوات",
      projects: 56,
      phone: "+967 777 567 890",
      email: "sara@example.com",
      image: "https://via.placeholder.com/200x200/e91e63/ffffff?text=Engineer",
      specialties: ["أنظمة الضخ الشمسي", "الطاقة المتجددة"],
      description: "مهندسة متخصصة في أنظمة الضخ الشمسي والطاقة المتجددة",
    },
    {
      id: 6,
      name: "يوسف عبدالرحمن",
      location: "إب",
      experience: "3-5 سنوات",
      projects: 28,
      phone: "+967 777 678 901",
      email: "yousef@example.com",
      image: "https://via.placeholder.com/200x200/607d8b/ffffff?text=Engineer",
      specialties: ["أنظمة الشبكة", "المراقبة عن بعد"],
      description: "مهندس متخصص في أنظمة الشبكة والمراقبة الذكية",
    },
  ];

  const locations = ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت"];
  const experienceLevels = [
    "1-3 سنوات",
    "3-5 سنوات",
    "5-10 سنوات",
    "10+ سنوات",
  ];

  const filteredEngineers = engineers.filter((engineer) => {
    const matchesSearch =
      engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !selectedLocation || engineer.location === selectedLocation;
    const matchesExperience =
      !selectedExperience || engineer.experience === selectedExperience;
    return matchesSearch && matchesLocation && matchesExperience;
  });

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
      <Paper sx={{ p: 3, mb: 4 }}>
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
      </Paper>

      {/* Engineers Grid */}
      <Grid container spacing={3}>
        {filteredEngineers.map((engineer) => (
          <Grid item xs={12} sm={6} md={4} key={engineer.id}>
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
              onClick={() => navigate(`/engineer/${engineer.id}`)}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Avatar
                  src={engineer.image}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {engineer.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                ></Box>
                <Chip
                  label={`${engineer.projects} مشروع`}
                  size="small"
                  color="primary"
                  sx={{ mb: 1 }}
                />
              </Box>

              <Divider />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ textAlign: "right" }}
                >
                  {engineer.description.length > 40
                    ? engineer.description.substring(0, 40) + "..."
                    : engineer.description}
                </Typography>
                {engineer.description.length > 40 && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/engineer/${engineer.id}`);
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
                    {engineer.location}
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
                    {engineer.experience}
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
                  {engineer.specialties.slice(0, 2).map((specialty, index) => (
                    <Chip
                      key={index}
                      label={specialty}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button size="small" color="primary" fullWidth>
                  عرض الملف الشخصي
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEngineers.length === 0 && (
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
