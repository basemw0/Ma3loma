const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: "103884765085-rdc234tg6ivsgr3cn5gifleraaer5b9p.apps.googleusercontent.com", 
    clientSecret: "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", 
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Check if user exists by email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // User exists, return them
        return done(null, user);
      } else {
        // 2. If no user, create one
        // Google doesn't give a username, so we generate a random one based on their name
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedUsername = profile.displayName.replace(/\s+/g, '') + randomNum;

        user = new User({
          username: generatedUsername,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          googleId: profile.id,
          // No password needed
        });

        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));