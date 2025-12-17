import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Divider } from '@mui/material'; // Added for styling
import api from '../src/api/axios';

export default function ChangePass({ open, onClose, Iuser }) {
    const [user, setUser] = useState(Iuser);
    const [correct, setCorrect] = useState(false);
    const [enterPass, setEnterPass] = useState('');
    const navigate = useNavigate();
    const [pass, setPass] = useState({
        pass: '',
        cPass: ''
    });

    const checkPass = async () => {
        try {
            const result = await api.put('/api/users/checkPass', { pass: enterPass });
            if (result.data) {
                setCorrect(true);
            } else {
                setCorrect(false);
            }
        } catch (e) {
            alert("Incorrect password");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (pass.pass != pass.cPass) {
            alert("Passwords don't match");
            return;
        }
        try {
            let response = await api.put('/api/users/changePass', { newPass: pass.pass });
            if (response.status == 200) {
                alert("Password succesfully updated");
                onClose();
                navigate('/login');
            } else {
                alert(response.status);
            }
        } catch (e) {
            alert("Error: " + e.message);
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
            <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Change Password</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    
                    {/* Step 1: Verification */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <TextField
                            autoFocus
                            required
                            id="password"
                            name="password"
                            label="Current Password"
                            type="password"
                            value={enterPass}
                            onChange={(e) => setEnterPass(e.target.value)}
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button 
                            onClick={checkPass} 
                            variant="contained" 
                            disabled={correct}
                            sx={{ 
                                borderRadius: 5, 
                                textTransform: 'none', 
                                fontWeight: 'bold', 
                                height: 40,
                                boxShadow: 'none'
                            }}
                        >
                            Verify
                        </Button>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Step 2: New Password Form */}
                    <form onSubmit={handleSubmit} id="subscription-form">
                        <Stack spacing={2}>
                            <TextField
                                required
                                disabled={!correct}
                                id="new-password"
                                name="password"
                                label="New Password"
                                type="password"
                                value={pass.pass}
                                onChange={(e) => setPass({ ...pass, pass: e.target.value })}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                required
                                disabled={!correct}
                                id="cPassword"
                                name="cPassword"
                                value={pass.cPass}
                                onChange={(e) => setPass({ ...pass, cPass: e.target.value })}
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Stack>
                    </form>
                </Box>
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
                    disabled={!correct}
                    sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 'bold', boxShadow: 'none', width : 30 , height : 40  }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}