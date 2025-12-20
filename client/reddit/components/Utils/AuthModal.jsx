import React, { useState } from 'react';
import {
  Dialog, DialogContent, TextField, Button, Typography, Box, IconButton, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { useAuthModal } from '../../src/context/AuthModalContext'; // Import the hook
import api from '../../src/api/axios';
import googleIcon from '../Pages/search.png'; // Make sure path is correct relative to this file
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
export default function AuthModal() {
  const { isOpen, closeModal, view, setView } = useAuthModal();
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");

  const switchView = (newView) => {
    setError("");
    reset();
    setView(newView);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${serverUrl}/auth/google`;
  };

  const onSubmit = async (data) => {
    setError("");
    try {
      let response;
      if (view === 'login') {
        response = await api.post("/api/users/login", {
          loginInput: data.username,
          password: data.password
        });
      } else {
        response = await api.post("/api/users/signup", {
          email: data.email,
          username: data.username,
          password: data.password,
          image: "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"
        });
      }

      const userData = view === 'login' ? response.data.user : response.data.user;

      if (userData && userData.token) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Reload to update UI 
        window.location.reload();
        closeModal();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: { borderRadius: 20, padding: '10px' }
      }}
    >
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {view === 'login' ? 'Log In' : 'Sign Up'}
          </Typography>
          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </Typography>

        {/* Google Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<img src={googleIcon} alt="G" style={{ width: 18 }} />}
          onClick={handleGoogleLogin}
          sx={{
            borderRadius: 5,
            textTransform: 'none',
            borderColor: '#dadce0',
            color: '#3c4043',
            fontWeight: 'bold'
          }}
        >
          Continue with Google
        </Button>

        <Divider>OR</Divider>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {view === 'signup' && (
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              {...register("email")}
              InputProps={{ style: { borderRadius: 25 } }}
            />
          )}

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            {...register("username")}
            InputProps={{ style: { borderRadius: 25 } }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            {...register("password")}
            InputProps={{ style: { borderRadius: 25 } }}
          />

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 5,
              textTransform: 'none',
              backgroundColor: '#FF4500',
              fontWeight: 'bold',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#e03e00' }
            }}
          >
            {view === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </form>

        {/* Toggle View */}
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          {view === 'login' ? "New to Reddit? " : "Already a redditor? "}
          <span
            style={{ color: '#0079D3', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => switchView(view === 'login' ? 'signup' : 'login')}
          >
            {view === 'login' ? 'Sign Up' : 'Log In'}
          </span>
        </Typography>

      </DialogContent>
    </Dialog>
  );
}