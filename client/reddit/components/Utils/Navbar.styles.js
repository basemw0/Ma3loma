import { styled, alpha } from "@mui/material/styles";
import { InputBase } from "@mui/material";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "999px",
  backgroundColor: "#f6f7f8",
  "&:hover": {
    backgroundColor: "#ffffff",
    border: "1px solid #0079d3",
  },
  border: "1px solid #edeff1",
  
  // --- UPDATED FOR CENTERING ---
  marginLeft: "auto", 
  marginRight: "auto",
  // -----------------------------

  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "40%",      // Adjust width relative to screen
    maxWidth: "600px", // Cap the width so it doesn't get too wide
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#878a8c",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

