// reseed.js
require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Models
const User = require("./models/User");
const Community = require("./models/Community");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Categories (your file)
const mockCategories = require("./config/interests");

// Mongo URI
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?retryWrites=true&w=majority";

// Seeder settings
const TOTAL_USERS = 20;
const TOTAL_COMMUNITIES = 50;
const TOTAL_POSTS = 2000;
const COMMENTS_PER_POST = 2;

// Helpers
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Flatten topics
const ALL_TOPICS = mockCategories.flatMap((cat) => cat.topics);

// ----------------------------------------
// CONNECT DB
// ----------------------------------------
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
}

// ----------------------------------------
// RESEED FUNCTION
// ----------------------------------------
async function reseed() {
  try {
    connectDB()
    console.log("🧹 Clearing old collections...");
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // --------------------------------------
    // USERS
    // --------------------------------------
    console.log("👤 Creating users...");

    const names = ["John", "Sarah", "Mark", "Linda", "Kevin", "Emma", "Omar", "Amir", "Rania", "Lara"];
    const hashedPass = await bcrypt.hash("password123", 10);

    const userDocs = [];
    for (let i = 0; i < TOTAL_USERS; i++) {
      const name = rand(names);
      const idTag = randInt(1000, 99999);

      userDocs.push({
        _id: crypto.randomUUID(),
        username: `${name}${idTag}`,
        email: `${name.toLowerCase()}${idTag}@mail.com`,
        password: hashedPass,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${idTag}`,
      });
    }

    const users = await User.insertMany(userDocs);
    const userIds = users.map((u) => u._id);
    console.log(`✅ Created ${users.length} users.`);

    // --------------------------------------
    // COMMUNITIES
    // --------------------------------------
    console.log("🌍 Creating communities...");

    const communityDocs = [];
    for (let i = 0; i < TOTAL_COMMUNITIES; i++) {
      const topic = rand(ALL_TOPICS);
      const nameTag = randInt(10, 9999);

      communityDocs.push({
        _id: crypto.randomUUID(),
        name: `${topic.replace(/\s+/g, "")}${nameTag}`,
        description: `Welcome to r/${topic}. Discuss all things ${topic}.`,
        icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${topic}${nameTag}`,
        banner: "https://picsum.photos/1200/300",
        interests: [topic],
        numberOfMembers: randInt(10, 200),
      });
    }

    const communities = await Community.insertMany(communityDocs);
    const communityIds = communities.map((c) => c._id);
    console.log(`✅ Created ${communities.length} communities.`);

    // --------------------------------------
    // POSTS
    // --------------------------------------
    console.log("📝 Creating posts...");

    const titles = [
      "Check this out!",
      "Is this normal?",
      "My setup",
      "Today's thought",
      "Question for everyone",
    ];

    const postDocs = [];
    for (let i = 0; i < TOTAL_POSTS; i++) {
      const up = randInt(0, 5);
      const down = randInt(0, 3);

      const postUpvotes = userIds.slice(0, up);
      const postDownvotes = userIds.slice(0, down);

      postDocs.push({
        _id: crypto.randomUUID(),
        title: rand(titles),
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        mediaUrl: Math.random() < 0.3 ? `https://picsum.photos/seed/${i}/600/400` : "",
        mediaType: Math.random() < 0.3 ? "image" : "none",
        userID: rand(userIds),
        communityID: rand(communityIds),
        upvotes: postUpvotes,
        downvotes: postDownvotes,
        voteCount: postUpvotes.length - postDownvotes.length,
        commentCount: 0,
        comments: [],
      });
    }

    const posts = await Post.insertMany(postDocs);
    console.log(`✅ Created ${posts.length} posts.`);

    // --------------------------------------
    // COMMENTS
    // --------------------------------------
    console.log("💬 Creating comments...");

    const commentsList = [];
    const postUpdates = [];

    posts.forEach((post) => {
      for (let i = 0; i < COMMENTS_PER_POST; i++) {
        const cid = crypto.randomUUID();

        commentsList.push({
          _id: cid,
          content: "Nice post!",
          userID: rand(userIds),
          postID: post._id,
        });

        postUpdates.push({
          updateOne: {
            filter: { _id: post._id },
            update: {
              $push: { comments: cid },
              $inc: { commentCount: 1 },
            },
          },
        });
      }
    });

    await Comment.insertMany(commentsList);
    await Post.bulkWrite(postUpdates);

    console.log(`✅ Created ${commentsList.length} comments.`);

    console.log("🎉 Reseed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Reseed failed:", err);
    process.exit(1);
  }
}

// ----------------------------------------
// RUN
// ----------------------------------------
// connectDB()
// reseed()
module.exports = {connectDB};
