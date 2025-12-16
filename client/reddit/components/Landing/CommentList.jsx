import React, { useState, useEffect } from "react";
import { Paper, Divider, Stack, Box } from "@mui/material";
import CommentItem from "./CommentItem";
import api from "../../src/api/axios";

export default function CommentList(props) {
  const [comments, setComments] = useState([]);
  const { search } = props;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get('/api/comments/search?q=' + search);
        if (response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error(error);
        setComments([]);
      }
    };
    if (search) fetchComments();
  }, [search]);

  return (
    <Paper 
        elevation={0} 
        sx={{ 
            width: "100%", 
            bgcolor: "#ffffff", 
            borderRadius: "4px" 
        }}
    >
      <Stack spacing={0}>
        {comments && comments.map((comm, index) => (
          <React.Fragment key={comm.matchedComment?._id || index}>
             <Box sx={{ px: 2 }}> 
                <CommentItem 
                    comment={comm.matchedComment} 
                    post={comm.post}
                />
             </Box>

             {index < comments.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </Stack>
    </Paper>
  );
}