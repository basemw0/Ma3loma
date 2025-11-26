import React, { useState } from "react";
import {
  SignupWrapper,
  SignupCard,
  RoundedInput,
  OrangeButton,
  Title,
  SubText,
  GoogleButton, // <-- added
} from "./Signup.styles";

import { Fade, InputAdornment, Box, Typography } from "@mui/material"; // <-- added Box, Typography
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import searchIcon from "./search.png"; // <-- added

export default function Signup() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

    const [touched, setTouched] = useState({
  email: false,
  code: false,
  username: false,
  password: false,
});



  const isEmailValid = email.includes("@");
  const isUsernameAvailable = username.length >= 4;

  const getBorderColor = (value, touched) => {
  if (!touched) return "#ccc";
  return value ? "green" : "red";
  
};

const continueWithGoogle = () => {
    window.location.href = "/auth/google";
    // or use your base URL
    // window.location.href = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/auth/google`;
  };

  const GoogleIcon = () => (
    <img
      src={searchIcon}
      alt="Google"
      style={{ width: 18, height: 18 }}
    />
  );

  return (
    <SignupWrapper>
      <SignupCard elevation={3}>
        {/* STEP 1 — EMAIL INPUT */}
        {step === 1 && (
          <Fade in={true}>
            <div>
              <Title variant="h5">Sign Up</Title>

              <RoundedInput
                  label={
                    <span>
                      Email <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                      "& fieldset": {
                        borderColor: getBorderColor(email, touched.email),
                      },
                      "&:hover fieldset": {
                        borderColor: getBorderColor(email, touched.email),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: getBorderColor(email, touched.email),
                      },
                    },
                  }}
                />


              <SubText>
                Already a redditor?{" "}
                <a href="/login" style={{ color: "#5495ff" }}>
                  Log in
                </a>
              </SubText>

              <OrangeButton
                fullWidth
                disabled={!isEmailValid}
                sx={{
                  backgroundColor: !isEmailValid ? "#ddd" : "#FF4500",
                }}
                onClick={() => setStep(2)}
              >
                Continue
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
            </div>
          </Fade>
        )}


        

        {/* STEP 2 — USERNAME + PASSWORD */}
        {step === 2 && (
          <Fade in={true}>
            <div>
              <Title variant="h6">Create your username and password</Title>

              <p
                style={{
                  fontSize: "14px",
                  color: "#444",
                  marginBottom: "16px",
                }}
              >
                Reddit is anonymous, so your username is what you’ll go by here.
                Choose wisely—because once you get a name, you can’t change it.
              </p>

              {/* USERNAME */}
              <RoundedInput
                  label={
                    <span>
                      Username <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched({ ...touched, username: true })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Fade in={Boolean(username)}>
                          <CheckCircleIcon sx={{ color: "green" }} />
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


              {username.length > 0 && (
                <p style={{ color: "green", marginTop: "-12px" }}>
                  Nice! Username available
                </p>
              )}

              {/* PASSWORD */}
              <RoundedInput
                  label={
                    <span>
                      Password <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Fade in={password.length >= 8}>
                          <CheckCircleIcon sx={{ color: "green" }} />
                        </Fade>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                      "& fieldset": {
                        borderColor: getBorderColor(password.length >= 8, touched.password),
                      },
                      "&:hover fieldset": {
                        borderColor: getBorderColor(password.length >= 8, touched.password),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: getBorderColor(password.length >= 8, touched.password),
                      },
                    },
                  }}
                />

              {/* ERROR MESSAGE */}
              {touched.password && password.length > 0 && password.length < 8 && (
                <p style={{ color: "red", marginTop: "-12px" }}>
                  Please lengthen this text to 8 characters or more (you are currently using {password.length} characters).
                </p>
              )}



              <OrangeButton
                fullWidth
                disabled={!username || !password}
                sx={{
                  backgroundColor:
                    !username || !password ? "#ddd" : "#FF4500",
                }}
              >
                Sign Up
              </OrangeButton>

              
            </div>
          </Fade>
        )}
      </SignupCard>
    </SignupWrapper>
  );
}
