const mongoose = require("mongoose");
const crypto = require('crypto');

const MessageSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },

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

  content: { type: String, default: "" }, 
  
  mediaUrl: { type: String, default: "" }, 
  mediaType: { 
    type: String, 
    enum: ["image", "video", "none"], 
    default: "none" 
  },

  read: { type: Boolean, default: false }

}, { timestamps: true });

MessageSchema.index({ conversationID: 1, createdAt: 1 });

module.exports = mongoose.model("Message", MessageSchema);