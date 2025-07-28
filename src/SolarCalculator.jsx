import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
  IconButton,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  SolarPower as SolarPowerIcon,
  FlashOn as FlashOnIcon,
  Speed as SpeedIcon,
  GridOn as GridOnIcon,
  BatteryChargingFull as BatteryIcon,
  Power as PowerIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const defaultAppliances = [
  { name: "calculator.appliances.light", key: "lights", watt: 12 },
  { name: "calculator.appliances.fan", key: "fans", watt: 70 },
  {
    name: "calculator.appliances.refrigerator",
    key: "refrigerator",
    watt: 200,
  },
  { name: "calculator.appliances.iron", key: "iron", watt: 1200 },
  { name: "calculator.appliances.other", key: "other", watt: 0 },
];

const SUN_HOURS = 5;
const PANEL_EFFICIENCY = 0.8;
const BATTERY_VOLTAGE = 12;
const BATTERY_DOD = 0.5;

export default function SolarCalculator() {
  const { t } = useTranslation();
  const [appliances, setAppliances] = useState(
    defaultAppliances.map((a) => ({
      ...a,
      quantity: 0,
      hours: 0,
      watt: a.watt,
    }))
  );
  const [results, setResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const handleChange = (idx, field, value) => {
    let numericValue = Number(value) || 0;

    // Validate hours to not exceed 24
    if (field === "hours" && numericValue > 24) {
      numericValue = 24;
    }

    // Validate quantity and watt to not be negative
    if ((field === "quantity" || field === "watt") && numericValue < 0) {
      numericValue = 0;
    }

    const updated = appliances.map((a, i) =>
      i === idx ? { ...a, [field]: numericValue } : a
    );
    setAppliances(updated);
  };

  const canCalculate = appliances.some((a) => a.quantity > 0 && a.hours > 0);

  const handleCalculate = (e) => {
    e.preventDefault();
    const totalDailyWh = appliances.reduce(
      (sum, a) => sum + a.watt * a.quantity * a.hours,
      0
    );
    const peakLoad = appliances.reduce(
      (sum, a) => sum + a.watt * a.quantity,
      0
    );
    const requiredPanelWatt = totalDailyWh / (SUN_HOURS * PANEL_EFFICIENCY);
    const panelWatt = 550;
    const numPanels = Math.ceil(requiredPanelWatt / panelWatt);
    const batteryAh = Math.ceil(totalDailyWh / (BATTERY_VOLTAGE * BATTERY_DOD));
    const inverterWatt = Math.ceil(peakLoad * 1.25);

    setResults({
      totalDailyWh: Math.round(totalDailyWh),
      peakLoad: Math.round(peakLoad),
      requiredPanelWatt: Math.ceil(requiredPanelWatt),
      numPanels,
      panelWatt,
      batteryAh,
      inverterWatt,
    });
    setShowResultsModal(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Calculator Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <CalculateIcon sx={{ color: "#16A34A" }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
            }}
          >
            {t("calculator.title")}
          </Typography>
        </Box>

        {/* Appliances Table */}
        <Box component="form" onSubmit={handleCalculate}>
          <Box
            sx={{
              bgcolor: "#F9FAFB",
              borderRadius: 2,
              p: 1.5,
              mb: 1,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 1,
            }}
          >
            <Typography sx={{ color: "#374151", fontWeight: 600, textAlign: "center" }}>
              {t("calculator.appliance")}
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 600, textAlign: "center" }}>
              {t("calculator.quantity")}
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 600, textAlign: "center" }}>
              {t("calculator.watt")}
            </Typography>
            <Typography sx={{ color: "#374151", fontWeight: 600, textAlign: "center" }}>
              {t("calculator.hoursPerDay")}
            </Typography>
          </Box>

          {appliances.map((appliance, idx) => (
            <Box
              key={appliance.key}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 1,
                p: 1.5,
                borderBottom: "1px solid #F3F4F6",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#1F2937" }}>{t(appliance.name)}</Typography>
              <TextField
                type="number"
                value={appliance.quantity}
                onChange={(e) => handleChange(idx, "quantity", e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FFFFFF",
                  },
                }}
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                }}
              />
              <TextField
                type="number"
                value={appliance.watt}
                onChange={(e) => handleChange(idx, "watt", e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FFFFFF",
                  },
                }}
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                  readOnly: appliance.key !== "other",
                }}
              />
              <TextField
                type="number"
                value={appliance.hours}
                onChange={(e) => handleChange(idx, "hours", e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FFFFFF",
                  },
                }}
                inputProps={{
                  min: 0,
                  max: 24,
                  style: { textAlign: "center" },
                }}
              />
            </Box>
          ))}

          {/* Calculate Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={!canCalculate}
            startIcon={<CalculateIcon />}
            sx={{
              mt: 3,
              bgcolor: "#16A34A",
              "&:hover": { bgcolor: "#15803D" },
              "&.Mui-disabled": { bgcolor: "#9CA3AF" },
              borderRadius: 3,
              py: 1.5,
              px: 3,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              width: "100%",
            }}
          >
            {t("calculator.calculate")}
          </Button>
        </Box>
      </Paper>

      {/* Results Modal */}
      <Modal
        open={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2.5,
        }}
      >
        <Paper
          sx={{
            maxWidth: 500,
            width: "100%",
            maxHeight: "80vh",
            borderRadius: 4,
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              borderBottom: "1px solid #F3F4F6",
            }}
          >
            <SolarPowerIcon sx={{ color: "#16A34A", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ color: "#1F2937", fontWeight: 700 }}
            >
              {t("calculator.results")}
            </Typography>
          </Box>

          {/* Results Content */}
          <Box sx={{ p: 2.5 }}>
            {results && (
              <>
                {/* Daily Energy */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <FlashOnIcon sx={{ color: "#16A34A" }} />
                  <Box>
                    <Typography sx={{ color: "#6B7280", mb: 0.5 }}>
                      {t("calculator.totalDailyEnergy")}
                    </Typography>
                    <Typography sx={{ color: "#1F2937", fontWeight: 700 }}>
                      {results.totalDailyWh} Wh
                    </Typography>
                  </Box>
                </Paper>

                {/* Peak Load */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <SpeedIcon sx={{ color: "#16A34A" }} />
                  <Box>
                    <Typography sx={{ color: "#6B7280", mb: 0.5 }}>
                      {t("calculator.peakLoad")}
                    </Typography>
                    <Typography sx={{ color: "#1F2937", fontWeight: 700 }}>
                      {results.peakLoad} W
                    </Typography>
                  </Box>
                </Paper>

                {/* Solar Panels */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <GridOnIcon sx={{ color: "#16A34A" }} />
                  <Box>
                    <Typography sx={{ color: "#6B7280", mb: 0.5 }}>
                      {t("calculator.solarPanels")}
                    </Typography>
                    <Typography sx={{ color: "#1F2937", fontWeight: 700 }}>
                      {results.numPanels} x {results.panelWatt}W
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                      {t("calculator.total")}: {results.requiredPanelWatt}W
                    </Typography>
                  </Box>
                </Paper>

                {/* Battery */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <BatteryIcon sx={{ color: "#16A34A" }} />
                  <Box>
                    <Typography sx={{ color: "#6B7280", mb: 0.5 }}>
                      {t("calculator.batterySize")}
                    </Typography>
                    <Typography sx={{ color: "#1F2937", fontWeight: 700 }}>
                      {results.batteryAh} Ah
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                      {t("calculator.batteryDetails")}
                    </Typography>
                  </Box>
                </Paper>

                {/* Inverter */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <PowerIcon sx={{ color: "#16A34A" }} />
                  <Box>
                    <Typography sx={{ color: "#6B7280", mb: 0.5 }}>
                      {t("calculator.inverterSize")}
                    </Typography>
                    <Typography sx={{ color: "#1F2937", fontWeight: 700 }}>
                      {results.inverterWatt} W
                    </Typography>
                  </Box>
                </Paper>
              </>
            )}
          </Box>

          {/* Modal Footer */}
          <Box sx={{ p: 2.5 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setShowResultsModal(false)}
              sx={{
                bgcolor: "#16A34A",
                "&:hover": { bgcolor: "#15803D" },
                borderRadius: 3,
                py: 1.5,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {t("calculator.ok")}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}
