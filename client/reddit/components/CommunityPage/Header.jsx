import React from 'react';
import { Box, Button, IconButton, Avatar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import api from '../../src/api/axios';
import { Link } from "react-router-dom";



export default function Header(props) {
    const {community , setJoined , joined } = props
    const handleJoinClick = async (status)=>{
      try{
        if(status == 'Joined'){
            alert(status)
            await api.post(`/api/communities/${community._id}/join`, {
              action : 0
            } )
            setJoined('Not Joined')
            alert("Unjoined")
        }
        else{
            alert(status)
            //Axios request
            await api.post("/api/communities/" + community._id + '/join', {
              action : 1
            } )
            setJoined('Joined')
            alert("Joined")
        }
      }
      catch(e){
        alert("Error" + e.message)
      }
    }
  return (
    <Box sx={{ width: '100%', bgcolor: '#fff' }}>
      {/* Banner Image */}
      <Box
        sx={{
          width: '100%',
          borderRadius : '10px',
          height: { xs: '80px', sm: '120px', md: '200px' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={community.banner}
          alt="Subreddit banner"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>
      {/* Info Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 2,
          bgcolor: '#fff',
        }}
      >
        {/* Left side - Avatar and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={community.icon}
            sx={{
              width: { xs: 56, md: 72 },
              height: { xs: 56, md: 72 },
              mt: { xs: -4, md: -6 },
              border: '4px solid white',
              bgcolor: '#ff4500'
            }}
          >
            PC
          </Avatar>
          
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.75rem' }
              }}
            >
              {community.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            </Box>
          </Box>
        </Box>

        {/* Right side - Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            component = {Link}
            to={`/api/posts/${community._id}/create`}
            sx={{
              borderColor: '#0079d3',
              color: '#0079d3',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              borderRadius: '20px',
              '&:hover': {
                borderColor: '#0079d3',
                bgcolor: 'rgba(0, 121, 211, 0.08)'
              },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Create Post
          </Button>

          <IconButton
            sx={{
              display: { xs: 'flex', sm: 'none' },
              bgcolor: 'darkgreen',
              color: 'white',
              '&:hover': { bgcolor: '#0066b8' }
            }}
          >
            <AddIcon />
          </IconButton>

          <Button
            variant="contained"
            onClick={()=>{handleJoinClick(joined)}}
            sx={{
              bgcolor: joined === 'Joined'?'white':'#0A514C',
              textTransform: 'none',
              color : joined === 'Joined'?'black':'white',
              border : joined === 'Joined'?'1px solid black':'none',
              fontWeight: 600,
              px: 4,
              borderRadius: '20px',
              '&:hover': { bgcolor: '#052826.' }
            }}
          >
            {joined == 'Joined'?'Joined' : 'Join'}
          </Button>

          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
} 