require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists by email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // User exists, return
        return done(null, user);
      } else {
        // If no user, create one
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedUsername = profile.displayName.replace(/\s+/g, '') + randomNum;

        user = new User({
          username: generatedUsername,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          googleId: profile.id,
        });

        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

