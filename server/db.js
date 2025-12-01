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

const connectDB = async () => {
  try {
    // Use your specific URI
    const uri = "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?appName=redditClone";
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ Connection error:", err);
    process.exit(1);
  }
};

// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get multiple random items
const getRandomSubset = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// --- 1. PREPARE VALID TOPICS ---
// Flatten the interests.js structure to get a clean list of all allowed topic strings
const ALL_VALID_TOPICS = ALLOWED_INTERESTS.flatMap(cat => cat.topics);

// --- 2. DATA GENERATION CONFIG ---
const USER_COUNT = 200;
const POSTS_PER_COMMUNITY = 20;

// 30 Music Communities -> Mapped to valid topic "Performing Arts"
const MUSIC_COMMUNITY_NAMES = [
    "LedZeppelin", "PinkFloyd", "Nirvana", "Metallica", "IronMaiden", "ACDC", "Queen", 
    "BlackSabbath", "TheRollingStones", "Aerosmith", "GunsNRoses", "PearlJam", "Soundgarden", 
    "AliceInChains", "Radiohead", "RedHotChiliPeppers", "GreenDay", "TheWho", "DeepPurple", 
    "JudasPriest", "Megadeth", "Slayer", "Pantera", "Motorhead", "TheClash", "Ramones", 
    "SexPistols", "DavidBowie", "TheCure", "TheSmiths"
];

// 40 Movie Communities -> Mapped to valid topic "Filmmaking"
const MOVIE_COMMUNITY_NAMES = [
    "PulpFiction", "FightClub", "TheMatrix", "JurassicPark", "ForrestGump", "TheLionKing", 
    "Titanic", "ShawshankRedemption", "Goodfellas", "Se7en", "SilenceOfTheLambs", "SavingPrivateRyan", 
    "SchindlersList", "Terminator2", "TheBigLebowski", "Fargo", "Trainspotting", "AmericanBeauty", 
    "Gladiator", "LordOfTheRings", "HarryPotter", "SpiderMan", "XMen", "TheDarkKnight", "Avatar", 
    "Shrek", "FindingNemo", "ToyStory", "TheIncredibles", "KillBill", "EternalSunshine", 
    "NoCountryForOldMen", "ThereWillBeBlood", "TheDeparted", "PansLabyrinth", "SpiritedAway", 
    "CityOfGod", "ThePianist", "LostInTranslation", "Amelie"
];

// 30 General Communities -> Will pick random valid topics
const GENERAL_COMMUNITY_NAMES = [
    "GamingSetup", "PCBuilds", "StreetFoodLover", "VeganRecipes", "CryptoCurrency", "WallStreetBets", 
    "AskReddit", "WorldNews", "Technology", "Futurism", "SpaceX", "NASA", "HistoryBuffs", 
    "Philosophy", "Psychology", "BookClub", "WritingPrompts", "ArtGallery", "DigitalPainting", 
    "PhotographyPro", "EarthPorn", "DIYProjects", "Woodworking", "Gardening", "FitnessGoals", "YogaLife", 
    "RunningClub", "Soccer", "Basketball", "Formula1"
];

const REAL_NAMES = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth",
    "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah"
];

const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
];

// --- MAIN SEED FUNCTION ---
const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old data...');
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // ---------------------------------------------------------
    // 1. CREATE USERS
    // ---------------------------------------------------------
    console.log(`👤 Creating ${USER_COUNT} Users...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const userDocs = [];

    for (let i = 0; i < USER_COUNT; i++) {
        const fName = getRandom(REAL_NAMES);
        const lName = getRandom(LAST_NAMES);
        const uniqueNum = Math.floor(Math.random() * 10000);
        
        userDocs.push({
            _id: crypto.randomUUID(),
            username: `${fName}${lName}${uniqueNum}`,
            email: `${fName.toLowerCase()}.${lName.toLowerCase()}${uniqueNum}@example.com`,
            password: hashedPassword,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${lName}${uniqueNum}`,
            goldBalance: Math.floor(Math.random() * 5000),
            // ✅ STRICT: Only assign topics from the valid list
            interests: getRandomSubset(ALL_VALID_TOPICS, 3),
            joinedCommunities: [],
            savedPosts: []
        });
    }
    
    const createdUsers = await User.insertMany(userDocs);
    const allUserIds = createdUsers.map(u => u._id);
    console.log('✅ Users created.');

    // ---------------------------------------------------------
    // 2. PREPARE COMMUNITY DATA
    // ---------------------------------------------------------
    console.log('🏘️ Creating Communities...');
    
    const allCommData = [];

    // Add Music Communities (Mapped to "Performing Arts")
    MUSIC_COMMUNITY_NAMES.forEach(name => {
        allCommData.push({ 
            name, 
            topic: "Performing Arts", // Matches 'Art' category in interests.js
            desc: `A community for fans of ${name} and rock music.`
        });
    });

    // Add Movie Communities (Mapped to "Filmmaking")
    MOVIE_COMMUNITY_NAMES.forEach(name => {
        allCommData.push({ 
            name, 
            topic: "Filmmaking", // Matches 'Art' category in interests.js
            desc: `Discuss the movie ${name} and cinema history.`
        });
    });

    // Add General Communities (Random valid topics)
    GENERAL_COMMUNITY_NAMES.forEach(name => {
        // Pick a random valid topic that kind of fits the name, or just random
        // For simplicity in seeding, we pick a random valid one from ALL_VALID_TOPICS
        const randomTopic = getRandom(ALL_VALID_TOPICS);
        allCommData.push({ 
            name, 
            topic: randomTopic, 
            desc: `The official community for ${name} discussion.`
        });
    });

    const communityDocs = [];

    for (const comm of allCommData) {
        const ownerID = getRandom(allUserIds);
        const modIDs = getRandomSubset(allUserIds.filter(id => id !== ownerID), 2);
        
        const moderatorObjects = [
            { user: ownerID }, 
            ...modIDs.map(id => ({ user: id }))
        ];

        communityDocs.push({
            _id: crypto.randomUUID(),
            name: comm.name,
            description: comm.desc,
            privacy: "public",
            icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${comm.name}`,
            banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
            // ✅ STRICT: Use the valid topic we assigned above
            interests: [comm.topic], 
            Rules: [
                { title: "Be Kind", description: "No hate speech allowed." },
                { title: "No Spam", description: "Don't post the same thing twice." }
            ],
            moderators: moderatorObjects,
            numberOfMembers: 1 + modIDs.length,
            Awards: [
                { name: "Gold", cost: 500, icon: "🥇" },
                { name: "Silver", cost: 200, icon: "🥈" },
                { name: "Rocket", cost: 1000, icon: "🚀" }
            ]
        });
    }

    const createdCommunities = await Community.insertMany(communityDocs);
    console.log(`✅ ${createdCommunities.length} Communities created.`);

    // ---------------------------------------------------------
    // 3. ASSIGN MEMBERSHIPS
    // ---------------------------------------------------------
    console.log('🔗 Linking Users to Communities...');
    
    for (const comm of createdCommunities) {
        const mods = comm.moderators.map(m => m.user);
        
        // Update Mods/Admin
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

        // Add random Members
        const randomMembers = getRandomSubset(allUserIds.filter(id => !mods.includes(id)), Math.floor(Math.random() * 20) + 10);
        
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
    // 4. CREATE POSTS
    // ---------------------------------------------------------
    console.log('📝 Creating Posts...');
    const postDocs = [];
    
    const postTemplates = [
        { title: "Thoughts on this?", content: "I recently discovered this and wanted to share." },
        { title: "Hidden detail I found", content: "Did anyone else notice this in the background?" },
        { title: "My collection so far", content: "It took me years to collect all of these." },
        { title: "Best scene ever", content: "This moment changed everything for me." },
        { title: "Unpopular opinion", content: "I actually prefer the original version." },
        { title: "Help me remember", content: "Can anyone identify this song/movie/item?" }
    ];

    const mediaTypes = ["image", "none", "image", "video"];

    for (const comm of createdCommunities) {
        for (let i = 0; i < POSTS_PER_COMMUNITY; i++) {
            const authorID = getRandom(allUserIds);
            const template = getRandom(postTemplates);
            const type = getRandom(mediaTypes);
            
            let mediaUrl = "";
            if (type === "image") mediaUrl = `https://picsum.photos/seed/${comm.name}${i}/600/400`;
            if (type === "video") mediaUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

            postDocs.push({
                _id: crypto.randomUUID(),
                title: `${template.title} [${i}]`,
                content: template.content,
                mediaUrl: mediaUrl,
                mediaType: type,
                userID: authorID,
                communityID: comm._id,
                upvotes: getRandomSubset(allUserIds, Math.floor(Math.random() * 15)),
                downvotes: getRandomSubset(allUserIds, Math.floor(Math.random() * 2)),
                awardsReceived: []
            });
        }
    }
    const createdPosts = await Post.insertMany(postDocs);
    console.log(`✅ ${createdPosts.length} Posts created.`);

    // ---------------------------------------------------------
    // 5. CREATE COMMENTS
    // ---------------------------------------------------------
    console.log('💬 Creating Comments...');
    const commentDocs = [];

    for (const post of createdPosts) {
        const numComments = Math.floor(Math.random() * 5) + 3;
        
        for (let k = 0; k < numComments; k++) {
            const commenterID = getRandom(allUserIds);
            const commentId = crypto.randomUUID();
            
            commentDocs.push({
                _id: commentId,
                content: getRandom(["Nice!", "I agree.", "No way.", "Source?", "Big if true.", "LOL"]),
                mediaType: "none",
                postID: post._id,
                userID: commenterID,
                replies: [],
                upvotes: getRandomSubset(allUserIds, Math.floor(Math.random() * 5)),
                awardsReceived: []
            });

            await Post.findByIdAndUpdate(post._id, { $push: { comments: commentId } });
        }
    }

    await Comment.insertMany(commentDocs);
    console.log(`✅ ${commentDocs.length} Comments created.`);

    console.log('🏁 SEEDING COMPLETE! Database is fully populated.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();

module.exports = connectDB;