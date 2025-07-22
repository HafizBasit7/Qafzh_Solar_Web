import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { green } from "@mui/material/colors";
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

  const handleChange = (idx, field, value) => {
    const updated = appliances.map((a, i) =>
      i === idx ? { ...a, [field]: value } : a
    );
    setAppliances(updated);
  };

  // Add a helper to check for invalid hours
  const hasInvalidHours = appliances.some((a) => a.hours > 24);

  const canCalculate =
    appliances.some((a) => a.quantity > 0 && a.hours > 0) && !hasInvalidHours;

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
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, background: green[50], borderRadius: 3 }}
      >
        <Typography
          variant="h4"
          mb={3}
          color={green[800]}
          fontWeight={700}
          align="center"
        >
          {t("calculator.title")}
        </Typography>
        <form onSubmit={handleCalculate}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>{t("calculator.appliance")}</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>{t("calculator.quantity")}</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>{t("calculator.watt")}</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>{t("calculator.hoursPerDay")}</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appliances.map((appliance, idx) => (
                  <TableRow key={appliance.key}>
                    <TableCell>{t(appliance.name)}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={appliance.quantity}
                        onChange={(e) =>
                          handleChange(idx, "quantity", Number(e.target.value))
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{
                          min: 0,
                          style: { width: 60, textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={appliance.watt}
                        onChange={(e) =>
                          handleChange(idx, "watt", Number(e.target.value))
                        }
                        variant="outlined"
                        size="small"
                        inputProps={{
                          min: 0,
                          style: { width: 80, textAlign: "center" },
                          readOnly: appliance.key !== "other",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={appliance.hours}
                        onChange={(e) =>
                          handleChange(idx, "hours", Number(e.target.value))
                        }
                        variant="outlined"
                        size="small"
                        error={appliance.hours > 24}
                        helperText={
                          appliance.hours > 24 ? t("calculator.hoursMax24") : ""
                        }
                        inputProps={{
                          min: 0,
                          max: 24,
                          style: { width: 60, textAlign: "center" },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={4} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              sx={{ background: green[600], color: "#fff", fontWeight: 600 }}
              disabled={!canCalculate}
            >
              {t("calculator.calculate")}
            </Button>
          </Box>
        </form>
        <Box
          mt={4}
          minHeight={40}
          textAlign="center"
          color={green[800]}
          fontSize={18}
        >
          {results && (
            <Box>
              <Typography variant="h6" color={green[900]} mb={2}>
                {t("calculator.results")}
              </Typography>
              <Typography>
                {t("calculator.totalDailyEnergy")}:{" "}
                <b>{results.totalDailyWh} Wh</b>
              </Typography>
              <Typography>
                {t("calculator.peakLoad")}: <b>{results.peakLoad} W</b>
              </Typography>
              <Typography>
                {t("calculator.solarPanels")}:{" "}
                <b>
                  {results.numPanels} x {results.panelWatt}W
                </b>{" "}
                ({t("calculator.total")}: {results.requiredPanelWatt}W)
              </Typography>
              <Typography>
                {t("calculator.batterySize")}: <b>{results.batteryAh} Ah</b>{" "}
                {t("calculator.batteryDetails")}
              </Typography>
              <Typography>
                {t("calculator.inverterSize")}: <b>{results.inverterWatt} W</b>
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
