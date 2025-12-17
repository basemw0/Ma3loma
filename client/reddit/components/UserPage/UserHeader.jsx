import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

export default function UserHeader({ user }) {
  return (
    <Box sx={{ width: '100%', bgcolor: '#fff' }}>
      {/* Banner Image */}
      <Box
        sx={{
          width: '100%',
          borderRadius: '10px',
          height: { xs: '80px', sm: '120px', md: '200px' },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#33a8ff' // Default color if no banner
        }}
      >
        {user.banner && (
          <Box
            component="img"
            src={user.banner}
            alt="User banner"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
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
            src={user.image}
            alt={user.username}
            sx={{
              width: { xs: 56, md: 72 },
              height: { xs: 56, md: 72 },
              mt: { xs: -4, md: -6 },
              border: '4px solid white',
              bgcolor: '#ff4500'
            }}
          />
          
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.75rem' }
              }}
            >
              u/{user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              u/{user.username} • {user.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}