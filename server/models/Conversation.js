const mongoose = require("mongoose");
const crypto = require('crypto');

const ConversationSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },

  participants: [{ 
    type: String, 
    ref: "User", 
    required: true 
  }],

  lastMessage: {
    content: String,
    senderID: { type: String, ref: "User" },
    read: { type: Boolean, default: false }, // Simple bool
    createdAt: Date
  }

}, { timestamps: true });

ConversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", ConversationSchema);