import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../src/api/axios";

import {
  SignupWrapper,
  SignupCard,
  RoundedInput,
  OrangeButton,
  Title,
  SubText,
  GoogleButton,
  SkipButton,
  ToastNotification,
} from "./Signup.styles";

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from "@mui/icons-material/Close";
import { Fade, InputAdornment, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import searchIcon from "./search.png";

export default function Signup() {
  const navigate = useNavigate(); // [cite: 5] Fixes initialization error
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [showToast, setShowToast] = useState(false);
  const [touched, setTouched] = useState({
    email: false, code: false, username: false, password: false,
  });

  const isEmailValid = email.includes("@");

  // Auto-dismiss toast
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => setShowToast(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleResend = () => {
    setShowToast(false);
    setTimeout(() => setShowToast(true), 100);
  };

  const getBorderColor = (value, touched) => {
    if (!touched) return "#ccc";
    return value ? "green" : "red";
  };

  const continueWithGoogle = () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    window.location.href = `${serverUrl}/auth/google`; // [cite: 14] Point to Backend
  };

  const GoogleIcon = () => (
    <img src={searchIcon} alt="Google" style={{ width: 18, height: 18 }} />
  );

  const handleSignup = async () => {
    try {
      const response = await api.post("/api/users/signup", {
        email: email,
        username: username,
        password: password,
        image: "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"
      });

      console.log("Signup Success:", response.data);

      if (response.data.user?.token) {
        localStorage.setItem("token", response.data.user.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <SignupWrapper>
      <SignupCard elevation={3}>

        {/* EMAIL INPUT */}
        {step === 1 && (
          <Fade in={true}>
            <div>
              <Title variant="h5">Sign Up</Title>
              <RoundedInput
                label={<span>Email <span style={{ color: "red" }}>*</span></span>}
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Fade in={Boolean(email)}>
                        <CheckCircleIcon sx={{ color: "#FF4500" }} />
                      </Fade>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }}
              />

              <SubText>
                Already a redditor?{" "}
                <a href="/login" style={{ color: "#5495ff", fontWeight: "bold", textDecoration: "none" }}>Log In</a>
              </SubText>

              <OrangeButton
                fullWidth
                disabled={!isEmailValid}
                sx={{ backgroundColor: !isEmailValid ? "#ddd" : "#FF4500" }}
                onClick={() => {
                  setStep(2);
                  setShowToast(true); // Show "Email Sent" toast
                }}
              >
                Continue
              </OrangeButton>

              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Box sx={{ flex: 1, height: 1, background: "#e0e0e0" }} />
                <Typography sx={{ mx: 2, fontSize: 12, color: "#6b6b6b" }}>or</Typography>
                <Box sx={{ flex: 1, height: 1, background: "#e0e0e0" }} />
              </Box>

              <GoogleButton variant="outlined" fullWidth startIcon={<GoogleIcon />} onClick={continueWithGoogle}>
                Continue with Google
              </GoogleButton>
            </div>
          </Fade>
        )}

        {/* VERIFICATION */}
        {step === 2 && (
          <Fade in={true}>
            <div>
              <Title variant="h5">Verify your email</Title>
              <p style={{ textAlign: "center", marginBottom: "20px" }}>
                Enter the 6-digit code we sent to <br /> {email}
              </p>

              <RoundedInput
                label="Verification Code"
                variant="outlined"
                fullWidth
                value={verifyCode}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setVerifyCode(val);
                }}
                inputProps={{ maxLength: 6 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }}
              />

              <SkipButton onClick={() => setStep(3)}>Skip</SkipButton>

              <OrangeButton
                fullWidth
                disabled={verifyCode.length !== 6}
                sx={{ backgroundColor: verifyCode.length !== 6 ? "#ddd" : "#FF4500" }}
                onClick={() => setStep(3)} // Move to Step 3
              >
                Continue
              </OrangeButton>
            </div>
          </Fade>
        )}

        {/* USERNAME + PASSWORD */}
        {step === 3 && (
          <Fade in={true}>
            <div>
              <Title variant="h6">Create your username and password</Title>
              <p style={{ fontSize: "14px", color: "#444", marginBottom: "16px" }}>
                Reddit is anonymous, so your username is what you’ll go by here.
              </p>

              {/* Username */}
              <RoundedInput
                label={<span>Username <span style={{ color: "red" }}>*</span></span>}
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched({ ...touched, username: true })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }}
              />

              {/* Password */}
              <RoundedInput
                label={<span>Password <span style={{ color: "red" }}>*</span></span>}
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }}
              />

              <OrangeButton
                fullWidth
                disabled={!username || !password}
                onClick={handleSignup}
                sx={{ backgroundColor: !username || !password ? "#ddd" : "#FF4500" }}
              >
                Sign Up
              </OrangeButton>
            </div>
          </Fade>
        )}
      </SignupCard>

      {/* Toast Notification */}
      <Fade in={step === 2 && showToast}>
        <ToastNotification>
          <WarningAmberIcon sx={{ color: "#fff" }} />
          <span>Email sent to {email}</span>
          <CloseIcon sx={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setShowToast(false)} />
        </ToastNotification>
      </Fade>
    </SignupWrapper>
  );
}