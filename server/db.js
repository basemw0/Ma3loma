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
// ✅ 1. ADDED MISSING IMPORTS
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

// Config
const mockCategories = require("./config/interests"); 

// Mongo URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?retryWrites=true&w=majority";

const CONFIG = {
  TOTAL_USERS: 100,
  TOTAL_COMMUNITIES: 100,
  TOTAL_POSTS: 5000,
  COMMENTS_PER_POST: 5, 
  MAX_VOTES: 150,
  // ✅ 2. ADDED MISSING CONFIG
  TOTAL_CHATS: 20,       // Number of conversations to create
  MSGS_PER_CHAT: 15      // Number of messages per conversation
};

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randSubset = (arr, count) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const ALL_TOPICS = mockCategories.flatMap((cat) => cat.topics);
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

// ---------------------------------------------------------
// 🆕 SEED CHATS ONLY
// ---------------------------------------------------------
async function seedChatsOnly() {
    await connectDB();
    console.log("💬 Starting Chat Seeding (Appending to existing data)...");

    try {
        // 1. Fetch Existing Users
        const users = await User.find().select('_id');
        const userIds = users.map(u => u._id.toString());

        if (userIds.length < 2) {
            console.log("❌ Not enough users to create chats.");
            process.exit(1);
        }

        console.log(`👤 Found ${userIds.length} users. Creating ${CONFIG.TOTAL_CHATS} conversations...`);

        for (let i = 0; i < CONFIG.TOTAL_CHATS; i++) {
            // Pick two distinct users
            const participants = randSubset(userIds, 2);
            const [userA, userB] = participants;

            // Check if chat already exists
            const exists = await Conversation.findOne({
                participants: { $all: [userA, userB] }
            });

            if (exists) {
                console.log(`Skipping existing chat between ${userA} and ${userB}`);
                continue;
            }

            // 2. Create Conversation
            const convId = crypto.randomUUID();
            const conversation = new Conversation({
                _id: convId,
                participants: [userA, userB],
                lastMessage: {} 
            });

            await conversation.save();

            // 3. Create Messages
            const numMessages = randInt(5, CONFIG.MSGS_PER_CHAT);
            let lastMsgDoc = null;

            for (let m = 0; m < numMessages; m++) {
                const sender = Math.random() > 0.5 ? userA : userB;
                const content = faker.lorem.sentence();
                
                // Create Message
                const message = await Message.create({
                    conversationID: convId,
                    senderID: sender,
                    content: content,
                    read: Math.random() > 0.3,
                    createdAt: faker.date.recent({ days: 10 }) 
                });

                lastMsgDoc = message;
            }

            // 4. Update Last Message
            if (lastMsgDoc) {
                await Conversation.findByIdAndUpdate(convId, {
                    lastMessage: {
                        content: lastMsgDoc.content,
                        senderID: lastMsgDoc.senderID,
                        read: lastMsgDoc.read,
                        createdAt: lastMsgDoc.createdAt
                    }
                });
            }
        }

        console.log("✅ Chats Seeded Successfully!");

    } catch (error) {
        console.error("Error seeding chats:", error);
    }

    process.exit(0);
}

// ---------------------------------------------------------
// OLD RESEED FUNCTION
// ---------------------------------------------------------
async function reseed() {
  await connectDB();
  console.log(`🚀 STARTING MASSIVE SEED...`);
  console.log("⚠️ 'reseed' is disabled here to protect data. Use 'seedChatsOnly()' at the bottom.");
  process.exit(0);
}

// Run the chat seeder
//seedChatsOnly(); 

module.exports = { connectDB, seedChatsOnly };