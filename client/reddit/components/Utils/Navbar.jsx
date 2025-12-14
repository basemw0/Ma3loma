import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  InputBase
} from "@mui/material";

import { styled } from "@mui/material/styles"; // Fix import source
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ma3lomaLogo from "./Ma3loma.jpeg";

// --- 1. STYLED COMPONENTS (Defined here to prevent import errors) ---


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "999px",
  backgroundColor: "#f6f7f8",
  "&:hover": {
    backgroundColor: "#ffffff",
    border: "1px solid #0079d3",
  },
  border: "1px solid #edeff1",
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "40%",
    maxWidth: "600px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#878a8c",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

// --- 2. MAIN COMPONENT ---

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  //Handling creation wizard open and close
  

  // Load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Dropdown handlers
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    handleClose();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    handleClose();
    navigate(`/profile/${user?.username}`);
  };

  // Button Style
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
    "&:hover": { bgcolor: "#bd3200", boxShadow: "none" }
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
        
        {/* --- LEFT: Logo --- */}
        <Tooltip title="Go to Ma3loma home">
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex", alignItems: "center", textDecoration: "none",
              color: "inherit", mr: { xs: 1, md: 2 }, cursor: "pointer"
            }}
          >
            <Box component="img" src={ma3lomaLogo} alt="Logo" sx={{ height: 32, mr: 1 }} />
            <Typography variant="h6" noWrap sx={{ fontWeight: "bold", display: { xs: "none", sm: "block" } }}>
              Ma3loma
            </Typography>
          </Box>
        </Tooltip>

        {/* --- CENTER: Search --- */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search Ma3loma"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>

        {/* --- RIGHT: Auth Logic --- */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", minWidth: "fit-content" }}>
          {!user ? (
            // GUEST VIEW
            <>
              <Button component={Link} to="/login" variant="outlined" 
                sx={{ ...buttonStyle, bgcolor: "transparent", color: "#D93900", border: "1px solid #D93900", "&:hover": { bgcolor: "#fff3f0", border: "1px solid #bd3200" } }}>
                Log In
              </Button>
              <Button component={Link} to="/signup" variant="contained" sx={buttonStyle}>
                Sign Up
              </Button>
            </>
          ) : (
            // LOGGED IN VIEW (Avatar + Dropdown)
            <>
              <IconButton onClick={handleMenuClick} size="small" aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
                <Avatar 
                  src={user.image} 
                  alt={user.username}
                  sx={{ width: 38, height: 38, border: "1px solid #dee0e1" }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '&:before': {
                      content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{user.username}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon> Log out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}