const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

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
      'SecretMoot',{expiresIn: 3600},
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
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

     let token;
     token = jwt.sign(
      { id: user._id },
      'SecretMoot',{expiresIn: 3600},
    )
    // Return user data (without password)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        goldBalance: user.goldBalance,
        interests: user.interests,
        joinedCommunities: user.joinedCommunities,
        savedPosts: user.savedPosts,
        image: "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png",
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};

module.exports = {
  getUsers,
  signup,
  login
};
