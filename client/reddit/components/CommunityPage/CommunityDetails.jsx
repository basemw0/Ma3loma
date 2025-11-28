import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import PublicIcon from '@mui/icons-material/Public';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

export default function CommunityDetails(props) {
  const { community } = props;

  return (
    <Box
      sx={{
        bgcolor: '#f1f1f1ff',
        borderRadius: 2,
        border : 'none',
        p: 3,
        maxWidth : '300px',
        maxHeight : '500px',
        overflowY : 'auto'
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 1,
          fontSize: '1.1rem'
        }}
      >
        r/{community.subreddit_name}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          color: '#7c7c7c',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          mb: 2
        }}
      >
        {community.subreddit_description}
      </Typography>

      {/* Created Date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CakeIcon sx={{ fontSize: 20, color: '#7c7c7c' }} />
        <Typography sx={{ color: '#7c7c7c', fontSize: '0.875rem' }}>
          Created {community.created_date}
        </Typography>
      </Box>

      {/* Public Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PublicIcon sx={{ fontSize: 20, color: '#7c7c7c' }} />
        <Typography sx={{ color: '#7c7c7c', fontSize: '0.875rem' }}>
          {community.visibility}
        </Typography>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          pt: 2,
          borderTop: '1px solid #edeff1'
        }}
      >
        {/* Subscribers */}
        <Box>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              mb: 0.5
            }}
          >
            {community.subscribers_count}
          </Typography>
          <Typography
            sx={{
              color: '#7c7c7c',
              fontSize: '0.875rem'
            }}
          >
            {community.subscribers_label}
          </Typography>
        </Box>

        {/* Online Users */}
        <Box>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              mb: 0.5
            }}
          >
            {community.online_users_count}
          </Typography>
          <Typography
            sx={{
              color: '#7c7c7c',
              fontSize: '0.875rem'
            }}
          >
            {community.online_users_label}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{marginTop : 1.5 , marginBottom : 1.5}}/>
      {/* <Paper sx={{ width: 320 }}> */}
      <Typography variant='subtitle' sx={{opacity: 0.4}}>
            {community.name} Rules
          </Typography>
      <MenuList sx={{textAlign : 'left'}} dense>
        {community.rules.map((rule , index)=>{
            return  <MenuItem>
          <ListItemText sx={{padding : 0}} >{index+1} {rule}</ListItemText>
        </MenuItem>
        })}
      </MenuList>
      <Divider sx={{margin : 1 }}/>
        <Typography variant='subtitle' sx={{opacity: 0.4 , padding : 1}}>
            Moderators
          </Typography>
      <MenuList 
  sx={{ 
    p: 0,
    '& .MuiMenuItem-root': {
      px: 0,
      py: 1.5,
      alignItems: 'flex-start'
    }
  }}
>
  {community.moderators.map((mod, index) => (
    <MenuItem key={index}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, width: '100%' }}>
        <Box
          component="img"
          src={mod.avatar}
          alt={mod.username}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
            {mod.username}
          </Typography>
          {/* {mod.flair && (
            <Box
              sx={{
                fontSize: '0.75rem',
                color: '#1c1c1c',
                bgcolor: mod.flairColor || '#f0f0f0',
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                mt: 0.5
              }}
            >
              {mod.flair}
            </Box>
          )} */}
          {mod.subtitle && (
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#7c7c7c',
                mt: 0.5
              }}
            >
              {mod.subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </MenuItem>
  ))}
</MenuList>
    {/* </Paper> */}
    </Box>
  );
}