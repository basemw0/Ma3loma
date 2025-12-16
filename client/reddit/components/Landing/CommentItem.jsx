import React from "react";
import {Box,Typography,Avatar,Stack,Paper, ListItemButton
} from "@mui/material";
import { Link } from "react-router-dom";
export default function CommentItem(props) {
    const {comment , post} = props

  return (
    <Box  sx={{ py: 2, cursor: "pointer" }} >
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Avatar 
          src={post.communityID.icon} 
          sx={{ width: 20, height: 20 }} 
        />
        <Typography component={Link} to={`/api/posts/${post._id}`} variant="caption" sx={{ fontWeight: "bold", color: "#1c1c1c" , textDecoration: 'none'}}>
          {post.communityID.name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#7c7c7c" }}>
          • {post.createdAt}
        </Typography>
      </Stack>

      <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.4, mb: 1.5, color: "#1A1A1B" }}>
        {post.title}
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: "#f6f7f8",
          p: 2, 
          borderRadius: "12px",
          mb: 1.5
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Avatar 
            sx={{ width: 20, height: 20, bgcolor: "#D93900", fontSize: "10px" }} // Default generic avatar color
            
            src={comment.userID.image}
          >
          </Avatar>
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {comment.username}
          </Typography>
        </Stack>

     
        <Typography variant="body2" sx={{ color: "#1c1c1c", mb: 2 }}>
          {comment.content}
        </Typography>

        <Typography variant="caption" sx={{ color: "#7c7c7c" }}>
          {comment.voteCount} votes
        </Typography>
      </Paper>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="caption" sx={{ color: "#7c7c7c" }}>
          {post.voteCount} votes
        </Typography>
      </Stack>

    </Box>
  );
}