import { styled } from "@mui/material/styles";
import { TextField, Button, Paper, Box, Typography } from "@mui/material";

// Wrapper: Gray background, matches SignupWrapper
export const ResetWrapper = styled(Box)(() => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f6f7f8",
}));


// The White Card: Matches SignupCard dimensions and elevation
export const ResetCard = styled(Paper)(() => ({
  padding: "30px",
  width: "380px",
  borderRadius: "12px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "@media (max-width: 600px)": {
    width: "100%",
    height: "100%",
    borderRadius: 0,
    justifyContent: "center",
  }
}));

// Input Field: Matches RoundedInput from Signup
export const ResetInput = styled(TextField)(() => ({
  marginBottom: "20px",
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "25px",
    backgroundColor: "#fff",
  },
  "& .MuiInputLabel-root": {
      fontSize: "14px",
  }
}));

// Button: Matches OrangeButton from Signup
export const ResetButton = styled(Button)(() => ({
  backgroundColor: "#cc3700",
  color: "#fff",
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "10px 0",
  borderRadius: "25px",
  width: "100%",
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#e03e00",
  },
  "&:disabled": {
    backgroundColor: "#ddd",
    color: "#888",
  },
}));


// Standard title for Reset Password
export const ResetTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "20px",
  marginBottom: "10px",
  textAlign: "center",
  color: "#1a1a1b",
}));

  // Standard subtitle for Step 1
export const Step1Subtitle = styled(Typography)(() => ({
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center", 
  color: "#000",
  marginBottom: "20px",
}));


// Small links
export const TextLink = styled("a")(() => ({
  color: "#0079d3",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "bold",
  cursor: "pointer",
  alignSelf: "flex-start",
  marginTop: "-10px",
  marginLeft: "5px",
  marginBottom: "20px",
  "&:hover": {
    textDecoration: "underline",
  },
}));

// Icons for navigation (Back arrow, Close X)
export const NavIconBtn = styled("div")(() => ({
  position: "absolute",
  cursor: "pointer",
  color: "#878a8c",
  padding: "8px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.05)",
    color: "#1a1a1b",
  },
}));

// The Toast/Notification
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