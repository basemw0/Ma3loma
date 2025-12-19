import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, Box, Stack, Typography } from '@mui/material'; // Added Box/Stack
import UploadButton from './CommunityCreation/CommunityVisuals/UploadButton';
import { useState } from 'react';
import api from '../src/api/axios';
import toast from 'react-hot-toast';

export default function EditProfile({ open, onClose, Iuser }) {
    const [user, setUser] = useState(Iuser);
    const handleSubmit = async (event) => {
        event.preventDefault();
        let username = user.username;
        let goldBalance = user.goldBalance;
        let image = user.image;
        try {
            const response = await api.put('/api/users/edit', {
                username,
                goldBalance,
                image
            });
            if (response.status == 200) {
               toast.success("Profile succesfully updated")
                onClose();
            } else {
                alert(response.status);
            }
        } catch (e) {
          toast.error("Failed to update profile")
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Edit Profile</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} id="subscription-form">
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        
                        {/* Username & Avatar Row */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={user.image}
                                    sx={{ width: 60, height: 60, border: '1px solid #edeff1' }}
                                />
                                {/* Optional hint text under avatar if needed, keeping logic pure though */}
                            </Box>
                            <TextField
                                autoFocus
                                required
                                id="username"
                                name="username"
                                label="Username"
                                type="username"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        {/* Gold Input */}
                        <Box>
                             <Typography variant="caption" sx={{fontWeight:'bold', color:'text.secondary', mb:0.5, display:'block'}}>
                                Gold Balance
                             </Typography>
                            <TextField
                                required
                                id="gold"
                                name="gold"
                                value={user.goldBalance}
                                onChange={(e) => setUser({ ...user, goldBalance: e.target.value })}
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="number"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        {/* Upload Button Area */}
                        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                Update Profile Picture
                            </Typography>
                            <UploadButton setCommunityVisuals={setUser} edit={true} />
                        </Box>

                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined"
                    sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold', color: '#666', borderColor: '#666' }}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    form="subscription-form"
                    variant="contained"
                    sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold', boxShadow: 'none', width : 30 , height : 40 }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}