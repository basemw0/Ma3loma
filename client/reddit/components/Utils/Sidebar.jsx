import React from "react";
import {
  Drawer,
  Toolbar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import InfoIcon from "@mui/icons-material/Info";
import ArticleIcon from "@mui/icons-material/Article";
import ExploreIcon from '@mui/icons-material/Explore';
import RedditIcon from '@mui/icons-material/Reddit';

import { Link } from "react-router-dom";

import SidebarSection from "./SidebarSection";
import { SidebarContainer } from "./Sidebar.styles";

export default function Sidebar({ open, onToggle, drawerWidth }) {
  const feedItems = [
    { label: "Home", icon: <HomeIcon />, to: "api/home" },
    { label: "Popular", icon: <WhatshotIcon />, to: "/popular" },
    { label: "Saved", icon: <StarBorderIcon />, to: "/saved" },
    { label: "Explore communities", icon: <ExploreIcon />, to: "/api/communities/category" },
    { label: "All communities", icon: <RedditIcon />, to: "/api/communities/best/1" },
  ];

  const resourceItems = [
    { label: "About Ma3loma", icon: <InfoIcon />, to: "/about" },
    { label: "Blog", icon: <ArticleIcon />, to: "/blog" },
  ];

  const drawer = (
    <SidebarContainer>
      <Toolbar />

      {/* FEEDS */}
      <SidebarSection title="FEEDS">
        {feedItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            to={item.to}
            sx={{ borderRadius: "999px", mx: 1, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </SidebarSection>

      <Divider sx={{ my: 1 }} />

      {/* RESOURCES */}
      <SidebarSection title="RESOURCES" defaultOpen={true}>
        {resourceItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            to={item.to}
            sx={{ borderRadius: "999px", mx: 1, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </SidebarSection>

      {/* COPYRIGHT FOOTER */}
            <Box sx={{ mt: "auto", p: 2, textAlign: "center", fontSize: "12px", color: "#888" }}>
                Ma3loma, Inc. © 2025. All rights reserved.
            </Box>
    </SidebarContainer>
  );

  return (
    <>
      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "0.3s ease",
            boxShadow: "3px 0px 10px rgba(0,0,0,0.2)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* DESKTOP DRAWER (collapsible) */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #edeff1",
            transition: "0.3s ease",
            backgroundColor: "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
