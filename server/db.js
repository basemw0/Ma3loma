require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    // Your specific MongoDB URI (Ensure you replace 'username' and 'pass' with real credentials or use .env)
    const uri = "mongodb+srv://MohamedWBadra:2512006.m@redditclone.5d2hpqu.mongodb.net/?appName=redditClone";
    
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ Connection error:", err);
    process.exit(1); // Stop the app if DB fails
  }
};

// This export allows the main server file to use connectDB
module.exports = connectDB;

const User = require('./models/User');
const Community = require('./models/Community');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// --- DUMMY DATA SETTINGS ---
const USER_COUNT = 5;
const COMMUNITIES = [
  { name: 'ReactDevs', description: 'The place for React hooks and components.' },
  { name: 'Photography', description: 'Sharing the best shots from around the world.' },
  { name: 'Memes', description: 'Daily dose of internet humor.' }
];

const seedData = async () => {
  try {
    // 1. Connect to DB (Call it inside if we plan to run this file directly)
    await connectDB();
    await Community.findByIdAndUpdate(
  "fbdc00d6-c7b0-4de8-895e-f98f5aea30b0",
  {
    $push: {
      // 1. Update Moderators
      // Schema requires: { user: String }
      moderators: {
        $each: [
          { user: "4c740372-7c91-4bc2-945c-58a7ee0109b5" },
          { user: "fe68c3e5-043a-4491-882c-e3f0e36277af" }
        ]
      },

      // 2. Update Rules
      // Schema requires: { title: String, description: String }
      // You must provide titles and descriptions, not just IDs.
      rules: {
        $each: [
          { 
            title: "Respect Privacy", 
            description: "Do not share personal info." 
          },
          { 
            title: "No Spam", 
            description: "No repeated posts." 
          }
        ],
        $slice: -10 // Keeps only the last 10 rules
      }
    }
  },
  { new: true, runValidators: true } // Returns the updated doc & checks schema
);
    
    // // 2. Clear existing data
    // console.log('🧹 Clearing old data...');
    // await User.deleteMany({});
    // await Community.deleteMany({});
    // await Post.deleteMany({});
    // await Comment.deleteMany({});

    // // 3. Create Users
    // console.log('👤 Creating Users...');
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash('password123', salt);

    // const userDocs = [];
    // for (let i = 0; i < USER_COUNT; i++) {
    //   userDocs.push(new User({
    //     username: `User_${i + 1}`,
    //     email: `user${i + 1}@example.com`,
    //     password: hashedPassword,
    //     // ✅ FIX: Add required 'image' field, using a unique placeholder avatar.
    //     image: `https://i.pravatar.cc/150?u=user${i + 1}`,
    //     goldBalance: 1000, // Give them gold so they can give awards!
    //     joinedCommunities: [],
    //     savedPosts: []
    //   }));
    // }
    // const savedUsers = await User.insertMany(userDocs);
    // console.log(`✅ ${savedUsers.length} users created.`);

    // // 4. Create Communities
    // console.log('🏘️ Creating Communities...');
    // const savedCommunities = [];

    // for (const commData of COMMUNITIES) {
    //   // Create community with inline Roles and Awards
    //   const community = new Community({
    //     name: commData.name,
    //     description: commData.description,
    //     Roles: ["admin", "moderator", "member"], // Matches your schema capitalization
        
    //     // The original schema (Community.js) relies on numberOfMembers: 1 default,
    //     // and the joinedCommunities array being in the User model.
        
    //     // Define Awards (Matches your schema capitalization)
    //     Awards: [
    //       { name: "Gold", cost: 100, icon: "🥇" },
    //       { name: "Silver", cost: 50, icon: "🥈" },
    //       { name: "Rocket", cost: 200, icon: "🚀" }
    //     ]
    //   });

    //   const savedComm = await community.save();
    //   savedCommunities.push(savedComm);

    //   // --- Membership Handling ---
    //   // The Community model defaults numberOfMembers to 1 (for the creator).
    //   // We will add the creator (User 0) as 'admin' and another user (User 1) as 'member'.

    //   // 1. Update User 0 (Admin/Creator) to know they joined.
    //   await User.findByIdAndUpdate(
    //     savedUsers[0]._id,
    //     // ✅ FIX: Use the full object structure required by User.js schema for joinedCommunities
    //     { $push: { joinedCommunities: { community: savedComm._id, role: 'admin' } } }
    //   );

    //   // 2. Update User 1 (Member) to know they joined.
    //   await User.findByIdAndUpdate(
    //     savedUsers[1]._id,
    //     // ✅ FIX: Use the full object structure required by User.js schema for joinedCommunities
    //     { $push: { joinedCommunities: { community: savedComm._id, role: 'member' } } }
    //   );
      
    //   // 3. Update the Community's member count to 2.
    //   await Community.findByIdAndUpdate(
    //     savedComm._id,
    //     { $set: { numberOfMembers: 2 } }
    //   );
    // }
    // console.log(`✅ ${savedCommunities.length} communities created.`);

    // // 5. Create Posts
    // console.log('📝 Creating Posts...');
    // const savedPosts = [];
    // const postConfigs = [
    //   { 
    //     title: "Look at my setup!", 
    //     type: "image", 
    //     url: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80", 
    //     content: "Is this clean code?" 
    //   },
    //   { 
    //     title: "Funny video", 
    //     type: "video", 
    //     url: "https://www.w3schools.com/html/mov_bbb.mp4", 
    //     content: "Watch till the end!" 
    //   },
    //   { 
    //     title: "Discussion about Hooks", 
    //     type: "none", 
    //     url: "", 
    //     content: "useEffect is tricky sometimes." 
    //   },
    // ];

    // for (const comm of savedCommunities) {
    //   for (const config of postConfigs) {
    //     const randomUser = savedUsers[Math.floor(Math.random() * savedUsers.length)];
        
    //     const post = new Post({
    //       title: `[${comm.name}] ${config.title}`,
    //       content: config.content,
    //       mediaUrl: config.url,
    //       mediaType: config.type,
    //       userID: randomUser._id,
    //       communityID: comm._id,
    //       upvotes: [savedUsers[0]._id, savedUsers[1]._id], // 2 fake upvotes
    //       downvotes: [],
          
    //       // Give this post an award (Ensure "Gold" exists in the community's awards)
    //       awardsReceived: [{
    //         awardName: "Gold",
    //         givenBy: savedUsers[0]._id,
    //         givenAt: new Date()
    //       }]
    //     });

    //     const savedPost = await post.save();
    //     savedPosts.push(savedPost);
        
    //     // Also save the post to User 0's savedPosts list
    //     await User.findByIdAndUpdate(savedUsers[0]._id, { $push: { savedPosts: savedPost._id } });
    //   }
    // }
    // console.log(`✅ ${savedPosts.length} posts created.`);

    // // 6. Create Comments
    // console.log('💬 Creating Comments...');
    
    // for (const post of savedPosts) {
    //   // Comment 1: Text only
    //   const comment1 = await Comment.create({
    //     content: "Great post!",
    //     mediaType: "none",
    //     postID: post._id,
    //     userID: savedUsers[0]._id,
    //     upvotes: [],
    //     awardsReceived: []
    //   });

    //   // Comment 2: With an Image (Reaction GIF style)
    //   const comment2 = await Comment.create({
    //     content: "My reaction to this:",
    //     mediaUrl: "https://placehold.co/100x100/orange/white?text=Reaction",
    //     mediaType: "image",
    //     postID: post._id,
    //     userID: savedUsers[1]._id,
    //     upvotes: [savedUsers[2]._id],
    //     // Give this comment an award (Ensure "Rocket" exists in the community's awards)
    //     awardsReceived: [{
    //        awardName: "Rocket",
    //        givenBy: savedUsers[0]._id
    //     }]
    //   });
      
    //   // Link comment back to post
    //   await Post.findByIdAndUpdate(post._id, { $push: { comments: comment1._id, comments: comment2._id }});
    // }

    // console.log('✅ Comments created.');
    console.log('🏁 SEEDING COMPLETE! Database is ready for React.');
    process.exit();

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

// Uncomment the line below and run 'node server/db.js' to seed your database.
seedData();