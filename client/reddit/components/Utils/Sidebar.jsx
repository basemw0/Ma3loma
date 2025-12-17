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
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";

import SidebarSection from "./SidebarSection";
import { SidebarContainer } from "./Sidebar.styles";
import { styled } from '@mui/material/styles';
import CreationWizard from '../CommunityCreation/CreationWizard'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    overflowY: 'visible',
  },
  '& .MuiDialogActions-root': {
    padding: 0,
  },
  '& .MuiPaper-root': {
     maxWidth: 'none',
     width: 'auto',
     backgroundImage: 'none',
  },
}));

export default function Sidebar({ open, onToggle, drawerWidth }) {

  const feedItems = [
    { label: "Home", icon: <HomeIcon />, to: "api/home" },
    { label: "Saved", icon: <StarBorderIcon />, to: "/api/posts/saved" },
    { label: "Explore communities", icon: <ExploreIcon />, to: "/api/communities/category" },
    { label: "All communities", icon: <RedditIcon />, to: "/api/communities/best/1" },
    { label: "Create a community", icon: <AddIcon />},
  ];

  const resourceItems = [
    { label: "About Ma3loma", icon: <InfoIcon />, to: "/about" },
  ];

  const [openWizard, setOpenWizard] = React.useState(false);
  const [dialogKey, setDialogKey] = React.useState(0);
  
  const handleClickOpen = () => {
    setDialogKey(prev => prev + 1); // Force remount
    setOpenWizard(true);
  };
  
  const handleClose = () => {
    setOpenWizard(false);
  };

  const drawer = (
    <SidebarContainer>
      <Toolbar />

      {/* FEEDS */}
      <SidebarSection title="FEEDS">
        {feedItems.map((item) => (
          item.label !== "Create a community" ? (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.to}
              sx={{ borderRadius: "999px", mx: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ) : (
            <ListItemButton
              key={item.label}
              onClick={handleClickOpen}
              sx={{ borderRadius: "999px", mx: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
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

      {/* DIALOG - Rendered OUTSIDE the drawer, only once */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openWizard}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            zIndex: 1,
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <CreationWizard close={close} />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}