import React from 'react';
import { Box, Typography, Divider, Button, Stack, Fab } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import ChatIcon from '@mui/icons-material/Chat';
import EditProfile from '../EditProfile'
import ChangePass from '../ChangePass';
import { useState } from 'react';
export default function UserDetails({ user }) {
      const [isEditOpen, setIsEditOpen] = useState(false);
      const handleOpen = () => setIsEditOpen(true);
      const handleClose = () => setIsEditOpen(false);

      const [isChangeOpen, setIsChangeOpen] = useState(false);
      const handleChangeOpen = () => setIsChangeOpen(true);
      const handleChangeClose = () => setIsChangeOpen(false);
  return (
    <>
      <Box
        sx={{
          bgcolor: '#f1f1f1ff',
          borderRadius: 2,
          p: 3,
          maxWidth: '300px',
          height: 'fit-content',
          display: { xs: 'none', md: 'block' }
        }}
      >
        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
          About u/{user.username}
        </Typography>

        {/* Description / Bio */}
        <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 1, mb: 2, border: '1px solid #edeff1' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.goldBalance || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Gold</Typography>
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

        {/* ---------------- BUTTONS LOGIC ---------------- */}
        
        {user.me ? (
          // IF IT IS ME: Show Edit & Change Password
          <Stack spacing={1}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<EditIcon />}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 'bold' }}
              onClick={handleOpen}
            >
              Edit Profile
            </Button>
            <EditProfile onClose={handleClose} open = {isEditOpen} Iuser = {user}/>
            
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<LockIcon />}
              sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 'bold' }}
              onClick={()=>{setIsChangeOpen(true)}}
            >
              Change Password
            </Button>
            <ChangePass Iuser = {user} open = {isChangeOpen} onClose={handleChangeClose}/>
          </Stack>
        ) : (
          null
        )}
      </Box>

      {/* ---------------- CHAT BUTTON (Bottom Right Corner) ---------------- */}
      {!user.me && (
        <Fab 
          color="primary" 
          variant="extended"
          aria-label="chat"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20, // <--- CHANGED FROM LEFT TO RIGHT
            zIndex: 9999,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 3
          }}
          onClick={() => alert("Open Chat Window")}
        >
          <ChatIcon sx={{ mr: 1 }} />
          Chat
        </Fab>
      )}
    </>
  );
}