const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 1. Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google redirects back here
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // Authentication successful, user is in req.user
    
    // Create Token
    const token = jwt.sign(
      { id: req.user._id },
      'SecretMoot',
      { expiresIn: 3600 }
    );

    // 3. Redirect to Frontend with Token
    // We pass the token in the URL so the frontend can grab it
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

module.exports = router;