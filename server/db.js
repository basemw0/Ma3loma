require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

// Models
const User = require("./models/User");
const Community = require("./models/Community");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// Config
const mockCategories = require("./config/interests"); 

// Mongo URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?retryWrites=true&w=majority";

// ---------------------------------------------------------
// ⚙️ "EVERYTHING" CONFIGURATION
// ---------------------------------------------------------
const CONFIG = {
  TOTAL_USERS: 100,
  TOTAL_COMMUNITIES: 100,
  TOTAL_POSTS: 5000,
  COMMENTS_PER_POST: 5, // ~25,000 Total Comments
  MAX_VOTES: 150,       // Higher variation in upvotes
};

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randSubset = (arr, count) => {
  // Fisher-Yates shuffle for true randomness
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

// Flatten topics for validation
const ALL_TOPICS = mockCategories.flatMap((cat) => cat.topics);

// Pre-defined Award Types for Posts/Comments
const GLOBAL_AWARDS = ["Gold", "Silver", "Platinum", "Wholesome", "Helpful"];

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
}

async function reseed() {
  await connectDB();
  console.log(`🚀 STARTING MASSIVE SEED (${CONFIG.TOTAL_POSTS} posts, ~${CONFIG.TOTAL_POSTS * CONFIG.COMMENTS_PER_POST} comments)...`);
  console.log("⏳ This may take a moment. Please wait...");

  // 1. CLEAR OLD DATA
  await User.deleteMany({});
  await Community.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  console.log("🧹 Database Cleared");

  // ---------------------------------------------------------
  // 2. CREATE USERS
  // ---------------------------------------------------------
  console.log(`👤 Generating ${CONFIG.TOTAL_USERS} Users...`);
  const passwordHash = await bcrypt.hash("password123", 10);
  const userDocs = [];

  for (let i = 0; i < CONFIG.TOTAL_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName }) + randInt(10, 9999);

    userDocs.push({
      _id: crypto.randomUUID(),
      username: username,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: passwordHash,
      image: faker.image.avatar(),
      goldBalance: randInt(0, 5000),
      interests: randSubset(ALL_TOPICS, randInt(3, 8)),
      googleId: Math.random() > 0.9 ? crypto.randomUUID() : undefined,
      joinedCommunities: [],
      savedPosts: [],
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
    });
  }

  const createdUsers = await User.insertMany(userDocs);
  const userIds = createdUsers.map((u) => u._id);
  console.log("✅ Users Inserted");

  // ---------------------------------------------------------
  // 3. CREATE COMMUNITIES
  // ---------------------------------------------------------
  console.log(`🌍 Generating ${CONFIG.TOTAL_COMMUNITIES} Communities...`);
  const communityDocs = [];

  for (let i = 0; i < CONFIG.TOTAL_COMMUNITIES; i++) {
    const topic = rand(ALL_TOPICS);
    const ownerId = rand(userIds);
    const name = `${topic.replace(/\s+/g, "")}_${faker.word.adjective()}_${randInt(1,999)}`;
    
    // Moderators (1-3 extra mods)
    const possibleMods = userIds.filter((id) => id !== ownerId);
    const mods = randSubset(possibleMods, randInt(1, 3)).map((uid) => ({ user: uid }));

    // Random Rules
    const numRules = randInt(3, 6);
    const rules = Array.from({ length: numRules }, () => ({
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence(),
    }));

    communityDocs.push({
      _id: crypto.randomUUID(),
      owner: ownerId,
      name: name,
      description: faker.lorem.paragraph(),
      Roles: ["admin", "moderator", "member", "vip", "bot"],
      rules: rules,
      moderators: mods,
      privacy: Math.random() > 0.9 ? "restricted" : "public",
      icon: faker.image.url({ width: 100, height: 100 }),
      banner: faker.image.url({ width: 1200, height: 300 }),
      interests: [topic, ...randSubset(ALL_TOPICS, 2)], // Primary topic + 2 randoms
      numberOfMembers: 1, // Start with 1 (owner), update later
      Awards: [
        { name: "Gold", cost: 500, icon: "🏆" },
        { name: "Silver", cost: 100, icon: "🥈" },
        { name: "Gem", cost: 200, icon: "💎" },
        { name: "Fire", cost: 50, icon: "🔥" },
      ],
      createdAt: faker.date.past({ years: 3 }),
      updatedAt: new Date(),
    });
  }

  const createdCommunities = await Community.insertMany(communityDocs);
  console.log("✅ Communities Inserted");

  // ---------------------------------------------------------
  // 4. MASSIVE JOIN (Users <-> Communities)
  // ---------------------------------------------------------
  console.log("🔗 Linking Users to Communities...");
  const userBulkOps = [];
  const commBulkOps = [];

  createdCommunities.forEach((comm) => {
    // 20-60 random members per community
    const members = randSubset(createdUsers, randInt(20, 60));
    
    // Update Community Member Count
    commBulkOps.push({
      updateOne: {
        filter: { _id: comm._id },
        update: { $set: { numberOfMembers: members.length + 1 } }, // +1 for owner
      },
    });

    // Update Users
    members.forEach((user) => {
      // Check if this user is a mod
      const isMod = comm.moderators.some((m) => m.user === user._id);
      
      userBulkOps.push({
        updateOne: {
          filter: { _id: user._id },
          update: {
            $push: {
              joinedCommunities: {
                community: comm._id,
                role: isMod ? "moderator" : "member",
                joinedAt: faker.date.past(),
              },
            },
          },
        },
      });
    });
  });

  if (userBulkOps.length) await User.bulkWrite(userBulkOps);
  if (commBulkOps.length) await Community.bulkWrite(commBulkOps);
  console.log("✅ Links Established");

  // ---------------------------------------------------------
  // 5. CREATE POSTS
  // ---------------------------------------------------------
  console.log(`📝 Generating ${CONFIG.TOTAL_POSTS} Posts (This is the big one)...`);
  const postDocs = [];

  for (let i = 0; i < CONFIG.TOTAL_POSTS; i++) {
    const author = rand(createdUsers);
    const comm = rand(createdCommunities);
    
    // Realistic Voting
    const numUp = randInt(0, CONFIG.MAX_VOTES);
    const numDown = randInt(0, Math.floor(CONFIG.MAX_VOTES / 5));
    const upvoters = randSubset(userIds, numUp);
    const downvoters = randSubset(userIds.filter(u => !upvoters.includes(u)), numDown);

    // Awards on Post
    const numAwards = Math.random() > 0.7 ? randInt(1, 5) : 0;
    const awardsReceived = Array.from({ length: numAwards }, () => ({
      awardName: rand(GLOBAL_AWARDS),
      givenBy: rand(userIds),
      givenAt: faker.date.recent(),
    }));

    postDocs.push({
      _id: crypto.randomUUID(),
      title: faker.lorem.sentence(randInt(3, 10)),
      content: faker.lorem.paragraphs(randInt(1, 4)),
      mediaUrl: Math.random() > 0.6 ? faker.image.url() : "",
      mediaType: Math.random() > 0.6 ? (Math.random() > 0.5 ? "image" : "video") : "none",
      voteCount: numUp - numDown,
      commentCount: 0, // Update later
      userID: author._id,
      communityID: comm._id,
      comments: [], // Update later
      upvotes: upvoters,
      downvotes: downvoters,
      awardsReceived: awardsReceived,
      createdAt: faker.date.recent({ days: 100 }),
      updatedAt: new Date(),
    });
  }

  // Insert Posts in one go
  const createdPosts = await Post.insertMany(postDocs);
  console.log("✅ Posts Inserted");

  // ---------------------------------------------------------
  // 6. CREATE COMMENTS (Batched for Performance)
  // ---------------------------------------------------------
  console.log(`💬 Generating ~${CONFIG.TOTAL_POSTS * CONFIG.COMMENTS_PER_POST} Comments...`);
  
  const commentDocs = [];
  const postUpdateOps = [];

  createdPosts.forEach((post) => {
    const numComments = randInt(0, CONFIG.COMMENTS_PER_POST);
    const postCommentIds = [];

    for (let k = 0; k < numComments; k++) {
      const commenter = rand(createdUsers);
      const commentId = crypto.randomUUID();

      // Root Comment
      commentDocs.push({
        _id: commentId,
        content: faker.lorem.sentences(randInt(1, 3)),
        postID: post._id,
        userID: commenter._id,
        parentID: null,
        replies: [],
        voteCount: randInt(0, 20),
        upvotes: [], // Keeping empty to save space/time, or populate if needed
        downvotes: [],
        awardsReceived: Math.random() > 0.9 ? [{ awardName: "Silver", givenBy: rand(userIds), givenAt: new Date() }] : [],
        createdAt: faker.date.recent(),
      });
      
      postCommentIds.push(commentId);

      // 40% Chance of a Reply
      if (Math.random() > 0.6) {
        const replyId = crypto.randomUUID();
        const replier = rand(createdUsers);
        
        commentDocs.push({
          _id: replyId,
          content: faker.lorem.sentence(),
          postID: post._id,
          userID: replier._id,
          parentID: commentId, // Parent is the comment above
          replies: [],
          voteCount: randInt(0, 10),
          createdAt: faker.date.recent(),
        });
      }
    }

    // Prepare Bulk Update for Post
    if (postCommentIds.length > 0) {
      postUpdateOps.push({
        updateOne: {
          filter: { _id: post._id },
          update: { 
            $push: { comments: { $each: postCommentIds } },
            $set: { commentCount: postCommentIds.length } // Simplification: counting root comments + replies is complex in bulk
          }
        }
      });
    }
  });

  // Batch Insert Comments (Node handles 30k objects fine usually)
  await Comment.insertMany(commentDocs);
  console.log(`✅ ${commentDocs.length} Comments Inserted`);

  // Update Posts with Comment IDs
  if (postUpdateOps.length) await Post.bulkWrite(postUpdateOps);

  // Link Replies to Parents
  // (We fetch all child comments and update their parents)
  const childComments = commentDocs.filter(c => c.parentID !== null);
  const replyOps = childComments.map(child => ({
    updateOne: {
      filter: { _id: child.parentID },
      update: { $push: { replies: child._id } }
    }
  }));

  if (replyOps.length) await Comment.bulkWrite(replyOps);
  console.log("✅ Comment Replies Linked");

  // ---------------------------------------------------------
  // 7. USER SAVED POSTS
  // ---------------------------------------------------------
  console.log("💾 Populating Saved Posts...");
  const saveOps = [];
  createdUsers.forEach(user => {
    // 30% chance to save 1-10 posts
    if (Math.random() > 0.7) {
      const saved = randSubset(createdPosts, randInt(1, 10)).map(p => p._id);
      saveOps.push({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { savedPosts: saved } }
        }
      });
    }
  });
  if (saveOps.length) await User.bulkWrite(saveOps);

  console.log("------------------------------------------------");
  console.log("🎉 SEEDING COMPLETE! The database is massive now.");
  console.log(`📊 Stats: ${createdUsers.length} Users, ${createdCommunities.length} Communities, ${createdPosts.length} Posts, ${commentDocs.length} Comments.`);
  console.log("------------------------------------------------");
  process.exit(0);
}

// reseed();
module.exports = {connectDB}