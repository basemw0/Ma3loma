require("dotenv").config();
const mongoose = require("mongoose");
const crypto = require("crypto");
const { faker } = require("@faker-js/faker");

// Models
const User = require("./models/User");
const Community = require("./models/Community");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

// Mongo URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?retryWrites=true&w=majority";

// ---------------------------------------------------------
// ⚙️ CONFIGURATION
// ---------------------------------------------------------
const CONFIG = {
  NUM_USERS: 300,             
  TARGET_COMMUNITIES: 100,    
  POSTS_PER_COMMUNITY: 50,    // 50 * 100 = 5000 Posts
  MAX_COMMENTS_PER_POST: 3,   
  MAX_VOTES_PER_ITEM: 50,     
  TOTAL_CHATS: 5,             
  MSGS_PER_CHAT: 5            
};

// ---------------------------------------------------------
// 📚 STRICT CATEGORIES (From Topics.js)
// ---------------------------------------------------------
const RAW_CATEGORIES = [
    {
        name: "Anime & Cosplay",
        topics: ["Anime & Manga", "Cosplay", "J-Culture", "Fan Art"]
    },
    {
        name: "Art",
        topics: ["Performing Arts", "Architecture", "Design", "Art", "Filmmaking", "Digital Art", "Photography", "Drawing", "Sculpture"]
    },
    {
        name: "Business & Finance",
        topics: ["Personal Finance", "Crypto", "Economics", "Business News & Discussion", "Deals & Marketplace", "Startups & Entrepreneurship", "Real Estate", "Stocks & Investing", "Venture Capital"]
    },
    {
        name: "Collectibles & Other Hobbies",
        topics: ["Model Building", "Collectibles", "Other Hobbies", "Toys", "Vintage", "Trading Cards", "Tabletop Games"]
    },
    {
        name: "Gaming",
        topics: ["PC Gaming", "Console Gaming", "Esports", "Mobile Gaming", "Retro Gaming", "Indie Games", "Role-Playing Games"]
    },
    {
        name: "Science & Technology",
        topics: ["Space", "Physics", "Chemistry", "Biology", "Gadgets", "Programming", "Artificial Intelligence", "Engineering"]
    },
    {
        name: "Food & Drink",
        topics: ["Cooking", "Baking", "Recipes", "Wine", "Beer", "Coffee", "Vegan", "Street Food"]
    },
    {
        name: "Fitness & Health",
        topics: ["Weightlifting", "Running", "Yoga", "Mental Health", "Nutrition", "Sleep", "Meditation"]
    }
];

const ALLOWED_TOPICS = RAW_CATEGORIES.flatMap(cat => cat.topics);

// ---------------------------------------------------------
// 🌍 MAPPED REAL COMMUNITIES (Safe List)
// ---------------------------------------------------------
const REAL_COMMUNITIES_BASE = [
  { name: "AskReddit", topic: "Other Hobbies" }, 
  { name: "funny", topic: "Other Hobbies" }, 
  { name: "gaming", topic: "PC Gaming" },
  { name: "aww", topic: "Other Hobbies" }, 
  { name: "pics", topic: "Photography" }, 
  { name: "science", topic: "Biology" },
  { name: "worldnews", topic: "Economics" }, 
  { name: "music", topic: "Performing Arts" }, 
  { name: "movies", topic: "Filmmaking" },
  { name: "books", topic: "Other Hobbies" }, 
  { name: "technology", topic: "Engineering" }, 
  { name: "todayilearned", topic: "Other Hobbies" },
  { name: "food", topic: "Cooking" }, 
  { name: "history", topic: "Other Hobbies" }, 
  { name: "showerthoughts", topic: "Other Hobbies" },
  { name: "nature", topic: "Photography" }, // Replaced earthporn
  { name: "landscapes", topic: "Photography" },
  { name: "explainlikeimfive", topic: "Other Hobbies" }, 
  { name: "lifeprotips", topic: "Personal Finance" },
  { name: "art", topic: "Art" }, 
  { name: "sports", topic: "Other Hobbies" }, 
  { name: "gadgets", topic: "Gadgets" },
  { name: "diy", topic: "Other Hobbies" }, 
  { name: "space", topic: "Space" }, 
  { name: "documentaries", topic: "Filmmaking" },
  { name: "nottheonion", topic: "Business News & Discussion" }, 
  { name: "dataisbeautiful", topic: "Programming" }, 
  { name: "tifu", topic: "Other Hobbies" },
  { name: "getmotivated", topic: "Mental Health" }, 
  { name: "photoshopbattles", topic: "Digital Art" }, 
  { name: "personalfinance", topic: "Personal Finance" },
  { name: "philosophy", topic: "Other Hobbies" }, 
  { name: "nosleep", topic: "Other Hobbies" }, 
  { name: "creepy", topic: "Other Hobbies" },
  { name: "listentothis", topic: "Performing Arts" }, 
  { name: "writingprompts", topic: "Other Hobbies" }, 
  { name: "fitness", topic: "Weightlifting" },
  { name: "travel", topic: "Other Hobbies" }, 
  { name: "interestingasfuck", topic: "Other Hobbies" }, 
  { name: "programming", topic: "Programming" },
  { name: "linux", topic: "Programming" }, 
  { name: "anime", topic: "Anime & Manga" }, 
  { name: "manga", topic: "Anime & Manga" },
  { name: "nintendo", topic: "Console Gaming" }, 
  { name: "xbox", topic: "Console Gaming" }, 
  { name: "playstation", topic: "Console Gaming" },
  { name: "pcgaming", topic: "PC Gaming" }, 
  { name: "gardening", topic: "Other Hobbies" }, 
  { name: "woodworking", topic: "Other Hobbies" },
  { name: "cooking", topic: "Cooking" }
];

const COMMUNITY_AWARDS = [
  { name: "Gold", cost: 500, icon: "🏆" },
  { name: "Silver", cost: 100, icon: "🥈" },
  { name: "Platinum", cost: 1800, icon: "💎" },
  { name: "Wholesome", cost: 125, icon: "🦭" },
  { name: "Fire", cost: 75, icon: "🔥" },
  { name: "Heart", cost: 50, icon: "❤️" },
  { name: "MindBlown", cost: 200, icon: "🤯" }
];

const SAMPLE_RULES = [
  { title: "Be Civil", description: "Treat others with respect." },
  { title: "No Spam", description: "Do not post spam, self-promotion, or irrelevant links." },
  { title: "Stay On Topic", description: "Posts must be relevant to the community theme." },
  { title: "Respect Privacy", description: "Do not post personal information of others." },
  { title: "No Reposts", description: "Check if the content has already been posted recently." },
  { title: "Cite Sources", description: "When posting news or claims, provide a valid source." },
  { title: "Use Flairs", description: "Categorize your posts correctly using flairs." }
];

// ---------------------------------------------------------
// 🛠 HELPERS
// ---------------------------------------------------------
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randSubset = (arr, count) => arr.sort(() => 0.5 - Math.random()).slice(0, count);
const uuid = () => crypto.randomUUID();

// ---------------------------------------------------------
// 🌱 MAIN SEED FUNCTION
// ---------------------------------------------------------
async function seedAll() {
  console.time("🌱 Seeding Time");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    console.log("⚠️  Wiping Database...");
    await Promise.all([
      User.deleteMany({}),
      Community.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({})
    ]);

    // -----------------------------------------------------
    // 1. GENERATE USERS
    // -----------------------------------------------------
    console.log(`👤 Generating ${CONFIG.NUM_USERS} users...`);
    const users = [];
    for (let i = 0; i < CONFIG.NUM_USERS; i++) {
      users.push({
        _id: uuid(),
        username: faker.internet.username() + randInt(100, 9999), 
        email: faker.internet.email(),
        password: await require("bcryptjs").hash("password123", 10),
        image: faker.image.avatar(),
        goldBalance: randInt(0, 1000),
        interests: [],
        joinedCommunities: [],
        createdAt: faker.date.past(),
      });
    }

    // -----------------------------------------------------
    // 2. GENERATE COMMUNITIES (100 Total)
    // -----------------------------------------------------
    console.log(`🏠 Generating ${CONFIG.TARGET_COMMUNITIES} communities...`);
    const communities = [];
    const usedNames = new Set();

    const addCommunity = (name, topic, description) => {
        if(usedNames.has(name.toLowerCase())) return;
        usedNames.add(name.toLowerCase());

        const owner = rand(users);
        const mods = randSubset(users, randInt(1, 2)).map(u => ({ user: u._id }));
        if (!mods.find(m => m.user === owner._id)) mods.push({ user: owner._id });
        const communityRules = randSubset(SAMPLE_RULES, randInt(3, 5));

        // Use Topic for Banner keyword
        const bannerKeyword = topic.split(' ')[0] || 'nature';

        communities.push({
            _id: uuid(),
            name: name,
            description: description || `Welcome to r/${name}. The best place to discuss ${topic}.`,
            owner: owner._id,
            moderators: mods,
            rules: communityRules,
            privacy: "public",
            icon: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`,
            banner: `https://source.unsplash.com/random/1200x400?${bannerKeyword}`, 
            interests: [topic], 
            numberOfMembers: 0, 
            Awards: randSubset(COMMUNITY_AWARDS, randInt(3, 5)),
            createdAt: faker.date.past()
        });
    };

    // A. Add Real Ones
    REAL_COMMUNITIES_BASE.forEach(c => addCommunity(c.name, c.topic, null));

    // B. Generate the rest (Up to 100)
    while(communities.length < CONFIG.TARGET_COMMUNITIES) {
        const topic = rand(ALLOWED_TOPICS); 
        
        const prefix = faker.word.adjective();
        const suffix = faker.word.noun();
        // Ensure no "porn" or bad words accidentally
        let cleanName = (prefix + suffix).replace(/[^a-zA-Z]/g, '');
        if (cleanName.toLowerCase().includes("porn")) cleanName = "Safe" + suffix;

        if(cleanName.length > 3) {
            addCommunity(cleanName, topic, faker.lorem.sentence());
        }
    }

    // -----------------------------------------------------
    // 3. JOIN USERS
    // -----------------------------------------------------
    console.log("🔗 Joining users to communities...");
    const communityMemberCounts = {};
    communities.forEach(c => communityMemberCounts[c._id] = 0);

    users.forEach(u => {
      const commsToJoin = randSubset(communities, randInt(3, 8)); 
      u.joinedCommunities = commsToJoin.map(c => {
        communityMemberCounts[c._id]++;
        return { community: c._id, role: "member" };
      });
    });

    communities.forEach(c => {
      c.numberOfMembers = communityMemberCounts[c._id];
    });

    // -----------------------------------------------------
    // 4. GENERATE POSTS (50 Per Community)
    // -----------------------------------------------------
    console.log(`📝 Generating posts (50 per community x 100 = ~5000)...`);
    const posts = [];
    const allComments = [];

    for (const comm of communities) {
      for (let i = 0; i < CONFIG.POSTS_PER_COMMUNITY; i++) {
        const author = rand(users);
        const postId = uuid();
        const isImage = Math.random() > 0.6; 

        // Votes
        const voteCountRaw = randInt(0, CONFIG.MAX_VOTES_PER_ITEM);
        const upCount = Math.floor(voteCountRaw * 0.8); 
        const downCount = voteCountRaw - upCount;
        const voters = randSubset(users, voteCountRaw);
        
        const post = {
          _id: postId,
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          mediaUrl: isImage ? faker.image.urlLoremFlickr({ category: 'abstract' }) : "",
          mediaType: isImage ? "image" : "none",
          voteCount: upCount - downCount, 
          commentCount: 0,
          userID: author._id,
          communityID: comm._id,
          upvotes: voters.slice(0, upCount).map(u => u._id),
          downvotes: voters.slice(upCount).map(u => u._id),
          awardsReceived: [],
          comments: [],
          createdAt: faker.date.recent({ days: 60 })
        };

        // Comments
        const numComments = randInt(0, CONFIG.MAX_COMMENTS_PER_POST);
        const postCommentsIDs = [];

        for (let c = 0; c < numComments; c++) {
            const commentId = uuid();
            const cAuthor = rand(users);
            const cVoteCount = randInt(0, 10);
            const cUp = Math.floor(cVoteCount * 0.9);
            const cDown = cVoteCount - cUp;
            const cVoters = randSubset(users, cVoteCount);

            const comment = {
                _id: commentId,
                content: faker.lorem.sentence(),
                postID: postId,
                userID: cAuthor._id,
                parentID: null,
                replies: [],
                voteCount: cUp - cDown,
                upvotes: cVoters.slice(0, cUp).map(u=>u._id),
                downvotes: cVoters.slice(cUp).map(u=>u._id),
                awardsReceived: [],
                createdAt: faker.date.recent({ days: 5 })
            };
            allComments.push(comment);
            postCommentsIDs.push(commentId);
        }

        post.comments = postCommentsIDs;
        post.commentCount = postCommentsIDs.length;
        posts.push(post);
      }
    }

    // -----------------------------------------------------
    // 5. GENERATE CHATS
    // -----------------------------------------------------
    console.log("💬 Generating minimal chats...");
    const conversations = [];
    const messages = [];

    for (let i = 0; i < CONFIG.TOTAL_CHATS; i++) {
        const [u1, u2] = randSubset(users, 2);
        const convId = uuid();
        let lastMsg = {};
        for(let m=0; m<CONFIG.MSGS_PER_CHAT; m++) {
             const sender = Math.random() > 0.5 ? u1 : u2;
             const msgDoc = {
                 _id: uuid(),
                 conversationID: convId,
                 senderID: sender._id,
                 content: faker.lorem.words(5),
                 read: true,
                 createdAt: faker.date.recent({ days: 2 })
             };
             messages.push(msgDoc);
             lastMsg = msgDoc;
        }
        conversations.push({
            _id: convId,
            participants: [u1._id, u2._id],
            lastMessage: {
                content: lastMsg.content,
                senderID: lastMsg.senderID,
                read: true,
                createdAt: lastMsg.createdAt
            }
        });
    }

    // -----------------------------------------------------
    // 6. SAVE TO DB
    // -----------------------------------------------------
    console.log(`💾 Writing to DB (approx ${(posts.length)} posts)...`);
    
    await User.insertMany(users);
    await Community.insertMany(communities);
    await Post.insertMany(posts);
    await Comment.insertMany(allComments);
    await Conversation.insertMany(conversations);
    await Message.insertMany(messages);

    const sampleCommunity = communities[0];
    const modUserId = sampleCommunity.owner;
    const modUser = users.find(u => u._id === modUserId);

    console.log("---------------------------------------");
    console.log(`✅ DONE!`);
    console.log(`Communities: ${communities.length}`);
    console.log(`Users:       ${users.length}`);
    console.log(`Posts:       ${posts.length}`);
    console.log("---------------------------------------");
    console.log("👑 MODERATOR CREDENTIALS (for testing):");
    console.log(`Community: r/${sampleCommunity.name}`);
    console.log(`Username:  ${modUser.username}`);
    console.log(`Password:  password123`);
    console.log("---------------------------------------");

  } catch (err) {
    console.error("❌ Seeding Failed:", err);
  } finally {
    process.exit(0);
  }
}

seedAll();