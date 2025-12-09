import { styled } from "@mui/material/styles";
import { TextField, Button, Paper, Box, Typography } from "@mui/material";

// Wrapper
export const SignupWrapper = styled(Box)(() => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f6f7f8",
}));

// White Card
export const SignupCard = styled(Paper)(() => ({
  padding: "30px",
  width: "380px",
  borderRadius: "12px",
  position: "relative", // required for absolute positioning of SkipButton
}));

// Inputs
export const RoundedInput = styled(TextField)(() => ({
  marginBottom: "20px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "25px",
  },
}));

// Orange Button
export const OrangeButton = styled(Button)(() => ({
  backgroundColor: "#cc3700",
  textTransform: "none",
  color: "#fff",
  fontWeight: "bold",
  padding: "10px 0",
  borderRadius: "25px",
  fontSize: "16px",
  "&:hover": {
    backgroundColor: "#e03e00",
  },
}));

// New Google button (same style as Login)
export const GoogleButton = styled(Button)(() => ({
  backgroundColor: "#fff",
  color: "#3c4043",
  border: "1px solid #dadce0",
  textTransform: "none",
  fontWeight: "bold",
  padding: "8px 0",
  borderRadius: "25px",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "#f7f8f9",
  },
}));

// Titles
export const Title = styled(Typography)(() => ({
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: "20px",
}));

// Text under fields
export const SubText = styled("p")(() => ({
  textAlign: "left",
  marginTop: "10px",
  marginBottom: "20px",
  color: "#000",
  fontSize: "14px",
}));

// Skip button — Top Right Corner
export const SkipButton = styled(Button)(() => ({
  position: "absolute",       // <--- Floating position
  top: "12px",                // Distance from top
  right: "12px",              // Distance from right
  textTransform: "none",
  color: "#576f76",           // "neutral-content-weak" gray
  fontWeight: "600",
  fontSize: "14px",
  minWidth: "auto",
  padding: "6px 12px",
  borderRadius: "999px",      // Pill shape hover
  zIndex: 10,                 // Ensure it is above other elements
  "&:hover": {
    backgroundColor: "rgba(87, 111, 118, 0.1)",
    color: "#576f76",
  },
}));

// <--- ADDED Toast Styles
export const ToastNotification = styled(Box)(() => ({
  position: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#1a1a1b",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "25px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 9999,
  fontSize: "14px",
  fontWeight: "500",
}));
