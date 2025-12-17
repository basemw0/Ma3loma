import React, { useState, useEffect } from "react";
import { Paper, Divider, Stack, Box } from "@mui/material";
import CommentItem from "./CommentItem";
import api from "../../src/api/axios";
import {Button} from "@mui/material";

export default function CommentList(props) {
  const [comments, setComments] = useState([]);
  const { search } = props;
  const [num , setNum] = useState(1)
  const fetchComments = async (num) => {
      try {
        const response = await api.get('/api/comments/search?q=' + search + '&page='+num);
        if (response.data) {
          if(num ===1){
            setComments(response.data);
        }
        else{
        setComments((prev)=>{
            return [...prev , ...response.data]
        });
        }
        }
      } catch (error) {
        console.error(error);
        setComments([]);
      }
    };
  const handleShowMore = () => {
        fetchComments(num)
        setNum(prev => prev + 1); 
    };

  useEffect(() => {
    if (search) fetchComments(1);
    setNum(2)
  }, [search]);

  return (
    <div style={{display :'flex' , flexDirection : 'column' , alignItems : 'center' , justifyContent : 'center' }}>
    <Paper 
        elevation={0} 
        sx={{ 
            width: "100%", 
            bgcolor: "#ffffff", 
            borderRadius: "4px",
            marginBottom : 1
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
    <Button onClick={handleShowMore} variant="text">Show more</Button>
    </div>
  );
}