const mongoose = require("mongoose");
const crypto = require('crypto');

const PostSchema = new mongoose.Schema({
  // ✅ Explicit String ID with UUID default
  _id: { type: String, default: () => crypto.randomUUID() },

  title: String,
  content: String,
  mediaUrl: { type: String, default: "" }, 
  mediaType: { 
    type: String, 
    enum: ["image", "video", "none"], 
    default: "none" 
  },

  // ✅ All references converted from ObjectId to String
  userID: { type: String, ref: "User", required: true },
  communityID: { type: String, ref: "Community" },

  comments: [{ type: String, ref: "Comment" }],
  upvotes: [{ type: String, ref: "User" }],
  downvotes: [{ type: String, ref: "User" }],
  awardsReceived: [{
    awardName: { type: String, required: true },
    givenBy: { type: String, ref: "User", required: true },
    givenAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

// ✅ AUTOMATIC CLEANUP HOOK
PostSchema.pre('findOneAndDelete', async function(next) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        // 1. Delete all comments that have this postID
        // (This triggers the Comment model's own hook to delete their replies too!)
        await mongoose.model('Comment').deleteMany({ postID: doc._id });
    }
    next();
});

module.exports = mongoose.model("Post", PostSchema);