import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import PublicIcon from '@mui/icons-material/Public';

export default function UserDetails({ user }) {
  return (
    <Box
      sx={{
        bgcolor: '#f1f1f1ff',
        borderRadius: 2,
        p: 3,
        maxWidth: '300px',
        height: 'fit-content', // Don't fix height so it fits content
        display: { xs: 'none', md: 'block' } // Hide on mobile like reddit usually does
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
        About u/{user.username}
      </Typography>

      {/* Description / Bio */}
      <Box
        sx={{
          bgcolor: '#fff',
          p: 2,
          borderRadius: 1,
          mb: 2,
          border: '1px solid #edeff1'
        }}
      >
         <Typography
          sx={{
            fontSize: '0.875rem',
            lineHeight: 1.5,
            mb: 1
          }}
        >
          {user.description || "This user hasn't written a bio yet."}
        </Typography>

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box>
                <Typography variant="h6" sx={{fontWeight:'bold'}}>{user.goldBalance || 0}</Typography>
                <Typography variant="caption" color="text.secondary">Gold</Typography>
            </Box>
            <Box>
                <Typography variant="h6" sx={{fontWeight:'bold'}}>1</Typography>
                <Typography variant="caption" color="text.secondary">Karma</Typography>
            </Box>
        </Box>
      </Box>

      {/* Created Date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CakeIcon sx={{ fontSize: 20, color: '#7c7c7c' }} />
        <Typography sx={{ color: '#7c7c7c', fontSize: '0.875rem' }}>
          Cake day {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      

    </Box>
  );
}

// Need to import Button for the follow button
import Button from '@mui/material/Button';