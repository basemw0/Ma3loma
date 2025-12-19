const mongoose = require("mongoose");
const ALLOWED_INTERESTS = require("../config/interests");
const allTopics = ALLOWED_INTERESTS.flatMap(item => item.topics);
const crypto = require('crypto');

const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },

  username: { 
    type: String, 
    required: [true, "Username is required"], 
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"]
  },
  goldBalance: { 
    type: Number, 
    default: 100, 
    min: [0, "Gold balance cannot be negative"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"], 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: false, 
    minlength: [6, "Password must be at least 6 characters"] 
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  image: {
    type: String,
    required: true,
  },
  interests: [{ 
    type: String, 
    enum: {
      values: allTopics, 
      message: '{VALUE} is not a supported interest' 
    }
  }],
  joinedCommunities: [{
    _id: false, 
    community: { 
      type: String, 
      ref: "Community",
      required: true
    },
    role: { 
      type: String, 
      default: "member" 
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  savedPosts: [{ type: String, ref: "Post" }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });
module.exports = mongoose.model("User", UserSchema);