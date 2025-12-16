import React from "react";
import {ListItem,ListItemButton,ListItemAvatar,Avatar,ListItemText,Typography,Box,Stack} from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function CommunityItem(props) {
    const {community} = props
    const navigate = useNavigate();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={()=>{navigate('/api/communities/'+community._id)}} alignItems="flex-start" sx={{ py: 2 }}>
        <ListItemAvatar sx={{ mt: 0 }}>
          <Avatar 
            src={community.icon} 
            sx={{ width: 40, height: 40, border: "1px solid #edeff1" }} 
          />
        </ListItemAvatar>

        <ListItemText
          primary={
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1c1c1c" }}>
              {community.name}
            </Typography>
          }
          secondary={
            <Stack component="span" spacing={0.5} mt={0.5}>
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                sx={{ display: "block" }}
              >
                {community.description}
              </Typography>
            </Stack>
          }
          disableTypography
        />
      </ListItemButton>
    </ListItem>
  );
}