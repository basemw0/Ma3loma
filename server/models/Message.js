const mongoose = require("mongoose");
const crypto = require('crypto');

const MessageSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },

  // Link to the conversation
  conversationID: { 
    type: String, 
    ref: "Conversation", 
    required: true 
  },

  // Who sent it?
  senderID: { 
    type: String, 
    ref: "User", 
    required: true 
  },

  content: { type: String, default: "" }, // Can be empty if sending just media
  
  // ✅ EXACT MATCH to your Post.js / Comment.js media structure
  mediaUrl: { type: String, default: "" }, 
  mediaType: { 
    type: String, 
    enum: ["image", "video", "none"], 
    default: "none" 
  },

  // ✅ Simple Boolean for 1-on-1 chat
  read: { type: Boolean, default: false }

}, { timestamps: true });

// Index: Find messages in a chat, sorted by time
MessageSchema.index({ conversationID: 1, createdAt: 1 });

module.exports = mongoose.model("Message", MessageSchema);