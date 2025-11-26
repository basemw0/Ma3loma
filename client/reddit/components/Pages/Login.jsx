import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, InputAdornment, Fade } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useForm } from "react-hook-form";
import api from "../../src/api/axios";
import searchIcon from "./search.png";

import {
  LoginWrapper,
  LoginCard,
  RoundedInput,
  OrangeButton,
  Title,
  GoogleButton,
} from "./Login.styles";

export default function Login() {
  const { register, handleSubmit, watch, setValue } = useForm();
  
  const username = watch("username");
  const password = watch("password");
  const isDisabled = !username || !password;

  // Track touched fields
  const [touched, setTouched] = useState({ username: false, password: false });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }

      window.location.href = "/";
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  // Helper to get border color
  const getBorderColor = (fieldValue, fieldTouched) => {
    if (!fieldValue && fieldTouched) return "#fb0808ff";
    if (fieldValue) return "green";
    return "#ccc";
  };

  const continueWithGoogle = () => {
    // If your backend is on the same origin or you have an API base proxy set, this will work:
    window.location.href = "/auth/google";

    // If your backend is on a different origin, use:
    // window.location.href = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

// Replace your GoogleIcon component with this:
const GoogleIcon = () => (
  <img
    src={searchIcon}
    alt="Google"
    style={{ width: 18, height: 18 }}
  />
);

  return (
    <LoginWrapper>
      <LoginCard elevation={3}>
        <Title variant="h5">Log In</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Username */}
          <RoundedInput
            label={ <>Email or username <span style={{ color: "#ee0000" }}>*</span> </> }
            variant="outlined"
            fullWidth
            {...register("username", { required: true })}
            onBlur={() => setTouched({ ...touched, username: true })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Fade in={Boolean(username)}>
                    <CheckCircleIcon sx={{ color: "#FF4500" }} />
                  </Fade>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                "& fieldset": {
                  borderColor: getBorderColor(username, touched.username),
                },
                "&:hover fieldset": {
                  borderColor: getBorderColor(username, touched.username),
                },
                "&.Mui-focused fieldset": {
                  borderColor: getBorderColor(username, touched.username),
                },
              },
            }}
          />

          {/* Password */}
          <RoundedInput
            label={ <>Password <span style={{ color: "#ee0000" }}>*</span> </> }
            type="password"
            variant="outlined"
            fullWidth
            {...register("password", { required: true })}
            onBlur={() => setTouched({ ...touched, password: true })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Fade in={Boolean(password)}>
                    <CheckCircleIcon sx={{ color: "#FF4500" }} />
                  </Fade>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                "& fieldset": {
                  borderColor: getBorderColor(password, touched.password),
                },
                "&:hover fieldset": {
                  borderColor: getBorderColor(password, touched.password),
                },
                "&.Mui-focused fieldset": {
                  borderColor: getBorderColor(password, touched.password),
                },
              },
            }}
          />

          {/* Forgot password link */}
          <a
            href="/signup"
            style={{
              color: "#5495ff",
              textDecoration: "none",
              fontSize: "14px",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Forgot Password?
          </a>

          {/* Signup */}
          <p style={{ textAlign: "left", marginTop: "16px", color: "#000" }}>
            New to Reddit?{" "}
            <a
              href="/signup"
              style={{
                color: "#5495ff",
                textDecoration: "none",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Sign up
            </a>
          </p>

          {/* Submit button */}
          <OrangeButton
            type="submit"
            fullWidth
            disabled={isDisabled}
            sx={{
              backgroundColor: isDisabled ? "#ddd" : "#FF4500",
              color: isDisabled ? "#888" : "#fff",
              "&:hover": {
                backgroundColor: isDisabled ? "#ddd" : "#e03e00",
              },
            }}
          >
            Log In
          </OrangeButton>

          {/* OR divider */}
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Box sx={{ flex: 1, height: 1, background: "#e0e0e0" }} />
            <Typography sx={{ mx: 2, fontSize: 12, color: "#6b6b6b" }}>or</Typography>
            <Box sx={{ flex: 1, height: 1, background: "#e0e0e0" }} />
          </Box>

          {/* Continue with Google */}
          <GoogleButton variant="outlined" fullWidth startIcon={<GoogleIcon />} onClick={continueWithGoogle}>
            Continue with Google
          </GoogleButton>
        </form>
      </LoginCard>
    </LoginWrapper>
  );
}
