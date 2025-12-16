require('dotenv').config();
const User = require('../models/User');
const Verification = require('../models/Verification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');


const transporter = nodemailer.createTransport({
  service: 'gmail', // or your provider
  auth: {
    user: process.env.EMAIL_USER, // e.g., 'yourname@gmail.com'
    pass: process.env.EMAIL_PASS 
  }
});
// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// User Signup
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username: username,
      email,
      password: hashedPassword,
      image: "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png",
 // You can set a default image or handle uploads
    });

    await user.save();
    let token;
     token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,{expiresIn: 3600},
    )
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during signup', error: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    // 1. Accept "loginInput" instead of just "email"
    const { loginInput, password } = req.body; 

    if (!loginInput || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required' });
    }

    // 2. Check if input matches EITHER email OR username
    const user = await User.findOne({
        $or: [
            { email: loginInput },
            { username: loginInput }
        ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB (Update if exists, or create new)
    await Verification.findOneAndUpdate(
      { email },
      { email, code },
      { upsert: true, new: true }
    );

    // Send Email
    await transporter.sendMail({
      to: email,
      subject: 'Your Reddit Verification Code',
      text: `Your code is: ${code}`
    });

    res.status(200).json({ message: 'Verification code sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending code', error: err.message });
  }
};

// ✅ 3. VERIFY CODE (Step 2 -> 3)
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const record = await Verification.findOne({ email, code });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    // Code is valid
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// ✅ 4. FORGOT PASSWORD (Request Link)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and save to User
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes
    await user.save();

    // Create Reset URL (Frontend URL)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Send Email
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

// ✅ 5. RESET PASSWORD (Actual Change)
const resetPassword = async (req, res) => {
  try {
    // Get token from URL params
    const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() } // Check if not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
const getMe = async (req, res) => {
  try {
    // req.userData is set by the check-auth middleware
    const user = await User.findById(req.userData.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
const getUserById = async (req, res) => {
  const userID = req.params.id
  try {
    // req.userData is set by the check-auth middleware
    const user = await User.findById(userID).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
module.exports = {
  getUsers,
  signup,
  login,
  sendVerificationCode,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  getUserById
};
