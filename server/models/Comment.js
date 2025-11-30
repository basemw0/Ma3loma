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

  
  parentID: { 
    type: String, 
    ref: "Comment", 
    default: null 
  },
  
  
  replies: [{ type: String, ref: "Comment" }],

  upvotes: [{ type: String, ref: "User" }],
  downvotes: [{ type: String, ref: "User" }],
  awardsReceived: [{
      awardName: { type: String, required: true },
      givenBy: { type: String, ref: "User", required: true },
      givenAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

CommentSchema.pre('findOneAndDelete', async function(next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc && doc.replies.length > 0) {
    
    await mongoose.model('Comment').deleteMany({ _id: { $in: doc.replies } });
  }
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);