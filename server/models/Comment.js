const mongoose = require("mongoose");
const crypto = require('crypto');

const CommentSchema = new mongoose.Schema({
  // ✅ Explicit String ID with UUID default
  _id: { type: String, default: () => crypto.randomUUID() },

  content: String,
  mediaUrl: { type: String, default: "" }, 
  mediaType: { 
    type: String, 
    enum: ["image", "video", "none"], 
    default: "none" 
  },

  // ✅ All references converted from ObjectId to String
  postID: { type: String, ref: "Post", required: true },
  userID: { type: String, ref: "User", required: true },

  upvotes: [{ type: String, ref: "User" }],
  downvotes: [{ type: String, ref: "User" }],
  awardsReceived: [{
      awardName: { type: String, required: true },
      givenBy: { type: String, ref: "User", required: true },
      givenAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);