import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Content from '../content/Content'
import { Outlet } from "react-router-dom";
import ChatWindow from '../Chat/ChatWindow';

const drawerWidth = 260;

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [floatingShrink, setFloatingShrink] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipDisabled, setTooltipDisabled] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  const openInboxChat = (user) => {
    setChatRecipient(user);
    setIsChatOpen(true);
  };

  const handleToggleSidebar = () => {
    setTooltipOpen(false);

    setTooltipDisabled(true);

    setTimeout(() => {
      setTooltipDisabled(false);
    }, 280);

    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setFloatingShrink(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f6f7f8" }}>
      {}
      <Navbar 
        onMenuClick={handleToggleSidebar} 
        onOpenChat={openInboxChat} 
      />

      {}
      <Sidebar
        open={sidebarOpen}
        onToggle={handleToggleSidebar}
        drawerWidth={drawerWidth}
      />

      {}
      <Tooltip
            title={sidebarOpen ? "Collapse Navigation" : "Expand Navigation"}
            arrow
            placement="right"
            enterDelay={220}        
            leaveDelay={80}        
            open={tooltipDisabled ? false : tooltipOpen}
            onOpen={() => setTooltipOpen(true)}
            onClose={() => setTooltipOpen(false)}
            disableFocusListener
            disableTouchListener
            componentsProps={{
                tooltip: {
                sx: {
                    bgcolor: "black",
                    color: "white",
                    fontSize: "13px",
                    borderRadius: "4px",
                    opacity: tooltipOpen ? 1 : 0,
                    transition: "opacity 0.15s ease-in-out",   // Reddit fade
                    py: 0.5,
                    px: 1.5,
                },
                },
                arrow: {
                sx: {
                    color: "black",
                },
                },
            }}
            >
            <IconButton
                onClick={handleToggleSidebar}
                onMouseEnter={() => !tooltipDisabled && setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                sx={{
                position: "fixed",
                left: sidebarOpen ? drawerWidth + 16 : 16,
                top: 90,
                zIndex: 3000,
                width: 42,
                height: 42,
                borderRadius: "50%",
                bgcolor: "#ffffff",
                border: "1px solid #d9d9d9",
                boxShadow: sidebarOpen
                    ? "4px 0px 20px rgba(0,0,0,0.25)"
                    : "0 2px 6px rgba(0,0,0,0.15)",
                transition:
                    "left 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": { bgcolor: "#f4f4f4" },
                display: { xs: "none", md: "flex" },
                transform: floatingShrink ? "scale(0.85)" : "scale(1)",
                }}
            >
                <MenuIcon />
            </IconButton>
        </Tooltip>


      {}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          ml: { xs: 0, md: sidebarOpen ? `${drawerWidth}px` : 0 },
          p: 2,
          overflow: "auto",
          transition: "margin-left 0.25s ease",
        }}
      >
        <Outlet />
      </Box>

      {}
      {isChatOpen && chatRecipient && (
        <ChatWindow 
          recipient={chatRecipient} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </Box>
  );
}