import React, { useState, useEffect } from "react";
import { Fade, InputAdornment } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'; 
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import api from "../../src/api/axios"; // ✅ Import API

import {
  ResetWrapper,
  ResetCard,
  ResetInput,
  ResetButton, 
  ResetTitle,
  Step1Subtitle,
  NavIconBtn,
  ToastNotification 
} from "./ForgotPassword.styles.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Validation: Check for @ symbol
  const isValid = email.includes("@");
  
  // Auto-dismiss toast
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => setShowToast(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  // ✅ CONNECTED TO BACKEND
  const handleReset = async () => {
    if (!isValid) return;
    setIsLoading(true);

    try {
      // Sends request to: /api/users/forgot-password
      await api.post("/api/users/forgot-password", { email });
      
      // On success, show next step
      console.log("Reset link sent to:", email);
      setStep(2); 
      setShowToast(true);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to send reset email";
      alert(msg); // Simple alert for error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setShowToast(false);
      await api.post("/api/users/forgot-password", { email });
      setTimeout(() => setShowToast(true), 100);
    } catch (error) {
      alert("Failed to resend email");
    }
  };

  const getBorderColor = (isValid, isTouched) => {
    if (!isTouched) return "#ccc";
    return isValid ? "green" : "red";
  };

  return (
    <ResetWrapper>
      <ResetCard elevation={3}>
        {/* Back Arrow (Step 1 only) */}
        {step === 1 && (
          <NavIconBtn style={{ left: "15px", top: "15px" }} onClick={() => navigate("/login")}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </NavIconBtn>
        )}

        {/* Close Button */}
        <NavIconBtn style={{ right: "15px", top: "15px" }} onClick={() => navigate("/")}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </NavIconBtn>

        {/* STEP 1: INPUT FORM */}
        {step === 1 && (
          <Fade in={true}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20px" }}>
              <ResetTitle variant="h5">Reset your password</ResetTitle>
              <Step1Subtitle>
                Enter your email address and we’ll send you a link to reset your password
              </Step1Subtitle>

              <ResetInput
                label={<span>Email <span style={{ color: "red" }}>*</span></span>}
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Fade in={isValid && touched}>
                        <CheckCircleIcon sx={{ color: "green" }} />
                      </Fade>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                      "& fieldset": { borderColor: getBorderColor(isValid, touched) },
                      "&:hover fieldset": { borderColor: getBorderColor(isValid, touched) },
                      "&.Mui-focused fieldset": { borderColor: getBorderColor(isValid, touched) },
                    },
                  }}
              />

              {/* Helper Link */}
              <a href="#" style={{ fontSize: "12px", color: "#0079d3", textDecoration: "none", alignSelf: "flex-start", marginBottom: "20px", marginLeft: "10px" }}>
                  Need help?
              </a>

              <ResetButton 
                fullWidth
                disabled={!isValid || isLoading} 
                onClick={handleReset}
                sx={{ backgroundColor: !isValid ? "#ddd" : "#FF4500" }}
              >
                {isLoading ? "Sending..." : "Reset password"}
              </ResetButton>
              
              {/* Login / Signup Links (Fixed to use Link) */}
              <div style={{ marginTop: "15px", display: "flex", alignItems: "center" }}>
                 <Link to="/login" style={{ fontSize: "12px", fontWeight: "600", color: "#0079d3", textDecoration: "none" }}>
                    LOG IN 
                 </Link>
                 <span style={{ margin: "0 5px", color: "#0079d3" }}>•</span>
                 <Link to="/signup" style={{ fontSize: "12px", fontWeight: "600", color: "#0079d3", textDecoration: "none" }}>
                    SIGN UP
                 </Link>
              </div>
            </div>
          </Fade>
        )}

        {/* STEP 2: CHECK INBOX */}
        {step === 2 && (
          <Fade in={true}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20px" }}>
              <ResetTitle variant="h5">Check your inbox</ResetTitle>
              
              <p style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                textAlign: "center",
                margin: "0.5rem 0",
                color: "#1a1a1b",
               }}>
                An email with a link to reset your password was sent to the email address associated with your account
              </p>

              <div style={{ margin: "20px 0" }}>
                 <MarkEmailUnreadIcon sx={{ fontSize: 80, color: "#FF4500" }} />
              </div>
              
              <p style={{ fontSize: "14px", color: "#1a1a1b" }}>
                Didn't get an email?{' '}
                <span 
                  onClick={handleResend}
                  style={{ color: "#0079d3", fontWeight: "bold", cursor: "pointer", textDecoration: "none" }}
                >
                  Resend
                </span>
              </p>
            </div>
          </Fade>
        )}
      </ResetCard>

      {/* TOAST NOTIFICATION */}
      <Fade in={step === 2 && showToast}>
        <ToastNotification>
            <WarningAmberIcon sx={{ color: "#fff" }} />
            <span>Email sent to {email}</span>
            <CloseIcon 
                sx={{ cursor: "pointer", marginLeft: "10px", fontSize: "18px" }} 
                onClick={() => setShowToast(false)} 
            />
        </ToastNotification>
      </Fade>

    </ResetWrapper>
  );
}