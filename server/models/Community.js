const mongoose = require("mongoose");
const ALLOWED_INTERESTS = require("../config/interests");
const crypto = require('crypto');
const allTopics = ALLOWED_INTERESTS.flatMap(item => item.topics);
const CommunitySchema = new mongoose.Schema({
  // ✅ Explicit String ID with UUID default
  _id: { type: String, default: () => crypto.randomUUID() },

  name: { type: String, required: true, unique: true },
  description: String,
  Roles: { 
    type: [String], 
    default: ["admin", "member"] 
  },
   rules:{type: [{
      _id: false, 
      title: { type: String, required: true }, 
      description: { type: String, required: true }
    }]},
    moderators: [{
    _id: false, 
    user: { 
      type: String, 
      ref: "User",
      required: true
    }}],
  privacy: {
    type: String,
    enum: ["public", "restricted", "private"],
    default: "public",
    message: '{VALUE} is not a supported privacy type'
  },
  icon: { type: String, default: "https://res.cloudinary.com/dp368vdzh/image/upload/v1764199563/reddit-planet_osteaw.jpg" },   
  banner: { type: String, default: "https://res.cloudinary.com/dp368vdzh/image/upload/v1764199647/baby-blue-color-solid-background-1920x1080_qxxp0v.png" },

  interests: [{ 
    type: String, 
    enum: {
      values: allTopics,
      message: '{VALUE} is not a supported interest' 
    }
  }],
  numberOfMembers: { type: Number, default: 1 },
  Awards: {
    type: [{
      _id: false, 
      name: { type: String, required: true }, 
      cost: { type: Number, required: true }, 
      icon: { type: String, default: "🏆" }
    }],
    default: () => [{ name: "Gold", cost: 100, icon: "🪙" }]
  }
}, { timestamps: true });

module.exports = mongoose.model("Community", CommunitySchema);