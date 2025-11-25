const mongoose = require("mongoose");
const ALLOWED_INTERESTS = require("../config/interests");
const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
Roles: { 
    type: [String], 
    default: ["admin", "member"] 
  },

  interests: [{ 
    type: String, 
    enum: {
      values: ALLOWED_INTERESTS,
      message: '{VALUE} is not a supported interest' // Custom error message
    }
  }],
  // ✅ 2. Members is now a detailed list, not just IDs
  // members: [{
  //   _id: false, // Saves space: we don't need a unique ID for the membership entry itself
  //   user: { 
  //     type: mongoose.Schema.Types.ObjectId, 
  //     ref: "User",
  //     required: true
  //   },
  //   role: { 
  //     type: String, 
  //     default: "member" // Default role as requested
  //   },
  //   joinedAt: {
  //     type: Date,
  //     default: Date.now
  //   }
  // }],
  numberOfMembers:{type: Number , default: 1},
  Awards: {
    type: [{
      _id: false, // We don't need an ID for the award definition
      name: { type: String, required: true }, 
      cost: { type: Number, required: true }, 
      icon: { type: String, default: "🏆" }
    }],
    // Default function creates the basic "Gold" award automatically
    default: () => [{ name: "Gold", cost: 100, icon: "🪙" }]
  }
}, { timestamps: true });

module.exports = mongoose.model("Community", CommunitySchema);
