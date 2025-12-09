import React, { useState } from "react";
import { Fade, InputAdornment } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams, useNavigate } from "react-router-dom"; // <--- To get the token
import api from "../../src/api/axios";

// Reuse styles from ForgotPassword (they are identical layouts)
import {
  ResetWrapper,
  ResetCard,
  ResetInput,
  ResetButton,
  ResetTitle,
  Step1Subtitle,
  ToastNotification
} from "./ForgotPassword.styles"; 

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from "@mui/icons-material/Close";

export default function ResetPassword() {
  const { token } = useParams(); // <--- GRAB TOKEN FROM URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Validation: At least 6 chars and match
  const isValid = password.length >= 6 && password === confirmPassword;

  const handleReset = async () => {
    if (!isValid) return;
    setIsLoading(true);

    try {
      // ✅ CALL THE BACKEND
      await api.put(`/api/users/reset-password/${token}`, { password });
      
      setToastMessage("Password changed! Redirecting...");
      setShowToast(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to reset password");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getBorderColor = (value, touched) => {
    if (!touched) return "#ccc";
    return value && value.length >= 6 ? "green" : "red";
  };

  return (
    <ResetWrapper>
      <ResetCard elevation={3}>
        <Fade in={true}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20px" }}>
            <ResetTitle variant="h5">Set New Password</ResetTitle>
            <Step1Subtitle>
              Enter your new password below.
            </Step1Subtitle>

            {/* New Password */}
            <ResetInput
              label={<span>New Password <span style={{ color: "red" }}>*</span></span>}
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Fade in={password.length >= 6}>
                      <CheckCircleIcon sx={{ color: "green" }} />
                    </Fade>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px", "& fieldset": { borderColor: getBorderColor(password, touched) } } }}
            />

            {/* Confirm Password */}
            <ResetInput
              label={<span>Confirm Password <span style={{ color: "red" }}>*</span></span>}
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={touched && password !== confirmPassword}
              helperText={touched && password !== confirmPassword ? "Passwords do not match" : ""}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }}
            />

            <ResetButton 
              fullWidth
              disabled={!isValid || isLoading} 
              onClick={handleReset}
              sx={{ backgroundColor: !isValid ? "#ddd" : "#FF4500" }}
            >
              {isLoading ? "Updating..." : "Set Password"}
            </ResetButton>
          </div>
        </Fade>
      </ResetCard>

      {/* Toast Notification */}
      <Fade in={showToast}>
        <ToastNotification>
            <WarningAmberIcon sx={{ color: "#fff" }} />
            <span>{toastMessage}</span>
            <CloseIcon sx={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => setShowToast(false)} />
        </ToastNotification>
      </Fade>
    </ResetWrapper>
  );
}