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






