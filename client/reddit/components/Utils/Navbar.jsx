import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import ma3lomaLogo from "./Ma3loma.jpeg";

// Import styles
import { Search, SearchIconWrapper, StyledInputBase } from "./Navbar.styles";

export default function Navbar() {
  // Styles for the buttons
  const buttonStyle = {
    textTransform: "none",
    borderRadius: "999px",
    fontWeight: 700,
    px: 3,
    boxShadow: "none",
    fontSize: "14px",
    height: "32px",
    bgcolor: "#D93900",
    color: "#fff",
    "&:hover": {
        bgcolor: "#bd3200",
        boxShadow: "none",
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#1c1c1c",
        borderBottom: "1px solid #edeff1",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important", display: "flex", justifyContent: "space-between" }}>
        
        {/* --- LEFT SIDE: Logo Only (No Burger Menu) --- */}
        <Tooltip
                title="Go to Ma3loma home"
                placement="left"
                arrow
                enterDelay={200}
                leaveDelay={0}
                componentsProps={{
                    tooltip: {
                    sx: {
                        bgcolor: "black",
                        color: "white",
                        fontSize: "13px",
                        borderRadius: "4px",
                        py: 0.5,
                        px: 1.5,
                        transition: "opacity 0.2s ease-in-out",
                    },
                    },
                    arrow: {
                    sx: { color: "black" },
                    },
                }}
                >
                <Box
                    component={Link}
                    to="/"
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    mr: { xs: 1, md: 2 },
                    cursor: "pointer",
                    }}
                >
                    <Box
                    component="img"
                    src={ma3lomaLogo}
                    alt="Ma3loma Logo"
                    sx={{ height: 32, mr: 1 }}
                    />
                    <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        fontWeight: "bold",
                        display: { xs: "none", sm: "block" },
                    }}
                    >
                    Ma3loma
                    </Typography>
                </Box>
            </Tooltip>


        {/* --- CENTER: Search Bar --- */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search Ma3loma"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        {/* --- RIGHT SIDE: Buttons --- */}
        <Box sx={{ display: "flex", gap: 1.5, minWidth: "fit-content", alignItems: "center" }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={buttonStyle}
            >
              Log In
            </Button>
            
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={buttonStyle}
            >
              Sign Up
            </Button>
        </Box>

        

      </Toolbar>
    </AppBar>
  );
}