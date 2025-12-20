import { Link } from "react-router-dom"; // ✅ Uses Link for smooth navigation
import { Box, Typography, InputAdornment, Fade } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useForm } from "react-hook-form";
import api from "../../src/api/axios";
import searchIcon from "./search.png";
import React, { useState, useEffect } from "react";
import {
  LoginWrapper,
  LoginCard,
  RoundedInput,
  OrangeButton,
  Title,
  GoogleButton,
} from "./Login.styles";

export default function Login() {
  const { register, handleSubmit, watch } = useForm();

  const username = watch("username");
  const password = watch("password");
  const isDisabled = !username || !password;

  const [touched, setTouched] = useState({ username: false, password: false });
  useEffect(() => {
    const handleGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);

        try {
         
          const response = await api.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` }
          });

          const userData = { ...response.data, id: response.data._id };
          localStorage.setItem("user", JSON.stringify(userData));

          window.location.href = "/";

        } catch (error) {
          console.error("Failed to fetch user details:", error);
          alert("Google Login failed to retrieve user data.");
        }
      }
    };

    handleGoogleLogin();
  }, []);
  const onSubmit = async (data) => {
    try {
      const response = await api.post("/api/users/login", {
        loginInput: data.username,
        password: data.password
      });

      const { token, ...userData } = response.data.user;

      if (token) {
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(userData));
        window.location.href = "/";
      } else {
        alert("Login successful but no token received.");
      }

    } catch (error) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Invalid email or password";
      alert(message);
    }
  };

  const getBorderColor = (fieldValue, fieldTouched) => {
    if (!fieldValue && fieldTouched) return "#fb0808ff";
    if (fieldValue) return "green";
    return "#ccc";
  };

  const continueWithGoogle = () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    window.location.href = `${serverUrl}/auth/google`;
  };

  const GoogleIcon = () => (
    <img src={searchIcon} alt="Google" style={{ width: 18, height: 18 }} />
  );

  return (
    <LoginWrapper>
      <LoginCard elevation={3}>
        <Title variant="h5">Log In</Title>

        <form onSubmit={handleSubmit(onSubmit)}>

          <RoundedInput
            label={<>Email or username <span style={{ color: "#ee0000" }}>*</span> </>}
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
                "& fieldset": { borderColor: getBorderColor(username, touched.username) },
                "&:hover fieldset": { borderColor: getBorderColor(username, touched.username) },
                "&.Mui-focused fieldset": { borderColor: getBorderColor(username, touched.username) },
              },
            }}
          />

          <RoundedInput
            label={<>Password <span style={{ color: "#ee0000" }}>*</span> </>}
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
                "& fieldset": { borderColor: getBorderColor(password, touched.password) },
                "&:hover fieldset": { borderColor: getBorderColor(password, touched.password) },
                "&.Mui-focused fieldset": { borderColor: getBorderColor(password, touched.password) },
              },
            }}
          />

          <Link
            to="/forgot-password"
            style={{
              color: "#5495ff",
              textDecoration: "none",
              fontSize: "15px", 
              fontWeight: "bold",
              display: "block",
              marginBottom: "16px"
            }}
          >
            Forgot Password?
          </Link>

          <p style={{ textAlign: "left", marginTop: "0", color: "#000" }}>
            New to Reddit?{" "}
            <Link
              to="/signup"
              style={{
                color: "#5495ff",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              Sign up
            </Link>
          </p>

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

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Box sx={{ flex: 1, height: 1, background: "#e0e0e0" }} />
            <Typography sx={{ mx: 2, fontSize: 12, color: "#6b6b6b" }}>or</Typography>
            <Box sx={{ flex: 1, height: 1, background: "#e0e0e0" }} />
          </Box>

          <GoogleButton variant="outlined" fullWidth startIcon={<GoogleIcon />} onClick={continueWithGoogle}>
            Continue with Google
          </GoogleButton>
        </form>
      </LoginCard>
    </LoginWrapper>
  );
}
