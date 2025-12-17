import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Link } from "@mui/material";

export default function UserListItem(props) {
  const {user} = props
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/api/profile/'+user._id);
  };

  return (
    <Box
      onClick={handleUserClick}
      sx={{
        display: "flex",
        padding: "16px",
        borderBottom: "1px solid #edeff1",
        cursor: "pointer",
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "#f6f7f8",
        },
      }}
    >
      <Box sx={{ marginRight: "12px" }}>
        <Avatar
          src={user.image}
          alt={user.username}
          sx={{ width: 36, height: 36 }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, fontSize: "14px", color: "#1c1c1c" }}
          >
            u/{user.username}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}