// db.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Import Models
const User = require('./models/User');
const Community = require('./models/Community');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const ALLOWED_INTERESTS = require('./config/interests'); 

// --- CONFIGURATION ---
const MONGO_URI = "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?appName=redditClone";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

// ✅ UPDATED COUNTS
const USER_COUNT = 10; 
const TOTAL_COMMUNITIES = 50;
const POSTS_PER_COMMUNITY = 20; // 50 * 20 = 1000 Posts

// Flatten topics for random selection
const ALL_VALID_TOPICS = ALLOWED_INTERESTS.flatMap(cat => cat.topics);

// Helper Functions
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const seedData = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected.");

    console.log('🧹 Clearing old data...');
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // ---------------------------------------------------------
    // 1. CREATE 10 USERS
    // ---------------------------------------------------------
    console.log(`👤 Creating ${USER_COUNT} Users...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const realNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];

    const userDocs = [];

    for (let i = 0; i < USER_COUNT; i++) {
        const fName = getRandom(realNames);
        const lName = getRandom(lastNames);
        const uniqueNum = Math.floor(Math.random() * 100000);
        
        userDocs.push({
            _id: crypto.randomUUID(), 
            username: `${fName}${lName}${uniqueNum}`,
            email: `${fName.toLowerCase()}.${lName.toLowerCase()}${uniqueNum}@example.com`,
            password: hashedPassword,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${lName}${uniqueNum}`,
            goldBalance: Math.floor(Math.random() * 5000),
            interests: getRandomSubset(ALL_VALID_TOPICS, 3), 
            joinedCommunities: [],
            savedPosts: []
        });
    }
    
    const createdUsers = await User.insertMany(userDocs);
    const allUserIds = createdUsers.map(u => u._id);
    console.log(`✅ ${createdUsers.length} Users created.`);

    // ---------------------------------------------------------
    // 2. CREATE 50 COMMUNITIES
    // ---------------------------------------------------------
    console.log(`🏘️ Creating ${TOTAL_COMMUNITIES} Communities...`);
    
    // 1. Define some specific manual ones (Total: 9)
    let communityDefinitions = [
        { name: "LedZeppelin", topic: "Performing Arts" },
        { name: "PinkFloyd", topic: "Performing Arts" },
        { name: "PulpFiction", topic: "Filmmaking" },
        { name: "FightClub", topic: "Filmmaking" },
        { name: "GamingSetup", topic: "PC Gaming" },
        { name: "AskReddit", topic: "Other Hobbies" },
        { name: "WorldNews", topic: "Business News & Discussion" },
        { name: "Technology", topic: "Gadgets" },
        { name: "Photography", topic: "Photography" }
    ];

    // 2. Auto-generate the rest to reach 50
    const needed = TOTAL_COMMUNITIES - communityDefinitions.length;
    const prefixes = ["Best", "Real", "Love", "Daily", "Pro", "Only", "True", "Fan", "My", "The"];
    
    for (let i = 0; i < needed; i++) {
        // Pick a random valid topic
        const randomTopic = getRandom(ALL_VALID_TOPICS);
        // Clean topic name for URL/Name usage (remove spaces/special chars)
        const cleanTopic = randomTopic.replace(/[^a-zA-Z0-9]/g, '');
        const prefix = getRandom(prefixes);
        const uniqueSuffix = Math.floor(Math.random() * 1000);
        
        communityDefinitions.push({
            name: `${prefix}${cleanTopic}${uniqueSuffix}`,
            topic: randomTopic
        });
    }

    const communityDocs = [];

    for (const comm of communityDefinitions) {
        const ownerID = getRandom(allUserIds);
        const modIDs = getRandomSubset(allUserIds.filter(id => id !== ownerID), 2);
        
        const moderatorObjects = [
            { user: ownerID }, 
            ...modIDs.map(id => ({ user: id }))
        ];

        communityDocs.push({
            _id: crypto.randomUUID(),
            name: comm.name,
            description: `The official community for ${comm.name} discussion.`,
            privacy: "public",
            icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${comm.name}`,
            banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
            interests: [comm.topic], 
            Rules: [
                { title: "Be Kind", description: "No hate speech allowed." },
                { title: "No Spam", description: "Don't post the same thing twice." }
            ],
            moderators: moderatorObjects,
            numberOfMembers: 1 + modIDs.length 
        });
    }

    const createdCommunities = await Community.insertMany(communityDocs);
    console.log(`✅ ${createdCommunities.length} Communities created.`);

    // ---------------------------------------------------------
    // 3. LINK MEMBERSHIPS
    // ---------------------------------------------------------
    console.log('🔗 Linking Users to Communities...');
    
    for (const comm of createdCommunities) {
        // 1. Add Mods/Admin roles
        const mods = comm.moderators.map(m => m.user);
        for (const modId of mods) {
            await User.findByIdAndUpdate(modId, {
                $push: { 
                    joinedCommunities: { 
                        community: comm._id, 
                        role: modId === mods[0] ? 'admin' : 'moderator' 
                    } 
                }
            });
        }

        // 2. Add regular members
        const potentialMembers = allUserIds.filter(id => !mods.includes(id));
        const randomMembers = getRandomSubset(potentialMembers, Math.floor(Math.random() * 5) + 1);
        
        for (const memberId of randomMembers) {
            await User.findByIdAndUpdate(memberId, {
                $push: { 
                    joinedCommunities: { community: comm._id, role: 'member' } 
                }
            });
        }

        await Community.findByIdAndUpdate(comm._id, {
            $inc: { numberOfMembers: randomMembers.length }
        });
    }

    // ---------------------------------------------------------
    // 4. CREATE 1000 POSTS (50 Comms * 20 Posts)
    // ---------------------------------------------------------
    console.log('📝 Creating Posts...');
    const postDocs = [];
    
    const postTitles = ["Thoughts on this?", "Hidden detail I found", "Unpopular opinion", "Can anyone help?", "Check this out", "My experience", "Question about this"];
    const mediaTypes = ["image", "none", "none", "video"];

    for (const comm of createdCommunities) {
        for (let i = 0; i < POSTS_PER_COMMUNITY; i++) {
            const authorID = getRandom(allUserIds);
            const type = getRandom(mediaTypes);
            
            let mediaUrl = "";
            if (type === "image") mediaUrl = `https://picsum.photos/seed/${comm.name}${i}/600/400`;
            if (type === "video") mediaUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

            postDocs.push({
                _id: crypto.randomUUID(),
                title: `${getRandom(postTitles)} in ${comm.name}`,
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                mediaUrl: mediaUrl,
                mediaType: type,
                userID: authorID, 
                communityID: comm._id, 
                upvotes: getRandomSubset(allUserIds, Math.floor(Math.random() * 8)),
                downvotes: [],
                voteCount: 0 
            });
        }
    }
    const createdPosts = await Post.insertMany(postDocs);
    console.log(`✅ ${createdPosts.length} Posts created.`);

    // ---------------------------------------------------------
    // 5. CREATE COMMENTS (Suitable Amount)
    // ---------------------------------------------------------
    console.log('💬 Creating Comments...');
    
    for (const post of createdPosts) {
        // Random 3 to 8 comments per post -> ~5500 total comments
        const numComments = Math.floor(Math.random() * 6) + 3;
        
        for (let k = 0; k < numComments; k++) {
            const commenterID = getRandom(allUserIds);
            const commentId = crypto.randomUUID();
            
            const newComment = new Comment({
                _id: commentId,
                content: getRandom(["Nice!", "I agree.", "No way.", "Source?", "Big if true.", "Interesting point.", "Can you explain more?", "Thanks for sharing!"]),
                postID: post._id,
                userID: commenterID,
                upvotes: []
            });
            await newComment.save();

            await Post.findByIdAndUpdate(post._id, { $push: { comments: commentId } });
        }
    }
    console.log('✅ Comments created.');

    console.log('🏁 SEEDING COMPLETE!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};
//seedData();

module.exports = connectDB;