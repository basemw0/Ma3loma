const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment'); 
const Community = require('./models/Community'); 
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


const getCommunities= async (req, res) => {
  const { userID } = req.query; // Who is asking?

  try {
    // 1. Get Top Communities (Your existing logic)
    // We use 'let' so we can modify this array later
    let communities = await Community.aggregate([
      { $sort: { numberOfMembers: -1 } },
      { $limit: 1000 }
    ]);

    // 2. If NO User ID is sent (Guest Mode), return basic info
    if (!userID) {
      return res.json(communities.map(c => ({
        ...c,
        isMember: false,
        userRole: "guest"
      })));
    }

    // 3. If User ID exists, fetch THEIR joined list
    // We select ONLY the joinedCommunities field to be fast
    const user = await User.findById(userID).select("joinedCommunities");

    if (!user) {
      // User ID provided but not found in DB
      return res.json(communities.map(c => ({
        ...c,
        isMember: false,
        userRole: "guest"
      })));
    }

   
    const userMap = {};
    user.joinedCommunities.forEach(entry => {
      userMap[entry.community.toString()] = entry.role;
    });

    // 5. Merge the data
    const personalizedCommunities = communities.map(comm => {
      const myRole = userMap[comm._id.toString()]; // Look up in the map
      
      return {
        ...comm,
        isMember: !!myRole, // Converts "admin" to true, undefined to false
        userRole: myRole || "guest"
      };
    });

    res.json(personalizedCommunities);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// ✅ CREATE COMMUNITY ENDPOINT
const createCommunity = async (req, res) => {
const { name, description, userID, interests } = req.body;
  // 1. Basic Validation
  if (!name || !userID) {
    return res.status(400).json({ message: "Name and UserID are required" });
  }

  try {
    const newCommunity = new Community({
      name,
      description,
      interests: interests || []
      // numberOfMembers defaults to 1
    });

    const savedCommunity = await newCommunity.save();

    // 2. Update the User (Creator -> Admin)
    await User.findByIdAndUpdate(userID, {
      $push: { 
        joinedCommunities: { 
          community: savedCommunity._id, 
          role: "admin"
        } ,
        $addToSet: {
        interests: { $each: interests || [] }
      }
      }
    });

    res.status(201).json(savedCommunity);

  } catch (err) {
    // 3. 🚨 HANDLE DUPLICATE NAME ERROR HERE
    if (err.code === 11000) {
      return res.status(400).json({ message: "Community name already taken" });
    }
    
    console.error("Error creating community:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// ✅ JOIN / LEAVE COMMUNITY (Toggle)
const joinCommunity= async (req, res) => {
  const communityID = req.params.id;
 const { userID, action } = req.body; // action = "join" or "leave"

  try {
    let userUpdateResult;

    if (action === 1) {
      // 🟢 JOIN LOGIC
      // Query: Find user ONLY if they do NOT already have this community in their list
      userUpdateResult = await User.updateOne(
        { _id: userID},
        { 
          $push: { 
            joinedCommunities: { community: communityID, role: "member" } 
          } ,
          $addToSet: { 
            interests: { $each: community.interests || [] } 
          }
        }
      );

      // Only increment count if the user was ACTUALLY added (modifiedCount > 0)
      if (userUpdateResult.modifiedCount > 0) {
        await Community.findByIdAndUpdate(communityID, { $inc: { numberOfMembers: 1 } });
        return res.json({ message: "Successfully joined", isMember: true });
      } else {
        return res.status(400).json({ message: "failed  to join" });
      }

    } else if (action === 0) {
      // 🛑 LEAVE LOGIC
      // Query: Find user ONLY if they HAVE this community
      userUpdateResult = await User.updateOne(
        { _id: userID },
        { 
          $pull: { joinedCommunities: { community: communityID } } 
        }
      );

      // Only decrement count if the user was ACTUALLY removed
      if (userUpdateResult.modifiedCount > 0) {
        await Community.findByIdAndUpdate(communityID, { $inc: { numberOfMembers: -1 } });
        return res.json({ message: "Successfully left", isMember: false });
      } else {
        return res.status(400).json({ message: "failed to leave" });
      }
    }

    res.status(400).json({ message: "Invalid action" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// ✅ GET COMMUNITY BY ID (With "Am I a Member?" Check)
const getCommunityById= async (req, res) => {
  const communityID = req.params.id;
  const { userID } = req.query; // Use ?userID=123 in the URL

  try {
    // 1. Find the Community
    const community = await Community.findById(communityID);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // 2. Default values (Guest)
    let isMember = false;
    let userRole = "guest";

    // 3. If User ID is sent, check the User's list
    if (userID) {
      const user = await User.findById(userID).select("joinedCommunities");
      
      if (user) {
        // Find the specific entry for this community
        const membership = user.joinedCommunities.find(
          (entry) => entry.community.toString() === communityID
        );

        if (membership) {
          isMember = true;
          userRole = membership.role; // "admin", "member", etc.
        }
      }
    }

    // 4. Return the merged data
    // We use .toObject() so we can attach custom fields to the Mongoose document
    res.json({
      ...community.toObject(),
      isMember,
      userRole
    });

  } catch (err) {
    console.error(err);
    // Handle invalid ID format (e.g. if ID is too short)
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid Community ID" });
    }
    res.status(500).send("Server Error");
  }
}

// ✅ SEARCH COMMUNITIES (With "isMember" check)
const searchCommunity= async (req, res) => {
  const { query, userID } = req.query;

  try {
    // --- 1. PREPARE USER LOOKUP MAP ---
    // We do this ONCE at the start so we can reuse it for any list we find
    const userMap = {};
    if (userID) {
      const user = await User.findById(userID).select("joinedCommunities");
      if (user) {
        user.joinedCommunities.forEach(entry => {
          userMap[entry.community.toString()] = entry.role;
        });
      }
    }

    // --- HELPER FUNCTION: Enhance a list of communities ---
    const enhance = (communityList) => {
      // If single object, wrap in array to map, then take first
      const isArray = Array.isArray(communityList);
      const list = isArray ? communityList : [communityList];

      const enhancedList = list.map(comm => {
        // Handle case where comm might be null/undefined
        if (!comm) return null; 
        
        // Mongoose documents need .toObject() to add custom fields safely
        const obj = comm.toObject ? comm.toObject() : comm;
        const myRole = userMap[obj._id.toString()];

        return {
          ...obj,
          isMember: !!myRole, // true if role exists
          userRole: myRole || "guest"
        };
      });

      return isArray ? enhancedList : enhancedList[0];
    };


    // --- 2. PERFORM SEARCH ---
    
    // Exact Match Logic
    const exactMatch = await Community.findOne({
      name: { $regex: new RegExp(`^${query}$`, "i") }
    });

    if (exactMatch) {
      // 🟢 SCENARIO 1: Found It
      const similarCommunities = await Community.find({
        _id: { $ne: exactMatch._id },
        interests: { $in: exactMatch.interests || [] }
      })
      .sort({ numberOfMembers: -1 })
      .limit(49);

      return res.json({
        found: true,
        // ✅ Enhance both the match and the list
        exactMatch: enhance(exactMatch),
        recommendations: enhance(similarCommunities)
      });

    } else {
      // 🔴 SCENARIO 2: Not Found
      let userRecommendations;
      
      if (!userID) {
        // Guest: Popular stuff
        userRecommendations = await Community.find().sort({ numberOfMembers: -1 }).limit(50);
      } else {
        // User: Interest-based stuff
        const user = await User.findById(userID);
        const filter = (user && user.interests.length > 0) 
          ? { interests: { $in: user.interests } } 
          : {}; 

        userRecommendations = await Community.find(filter)
          .sort({ numberOfMembers: -1 })
          .limit(50);
      }

      return res.json({
        found: false,
        message: `r/${query} not found. Here are some communities based on your interests:`,
        // ✅ Enhance the list
        recommendations: enhance(userRecommendations)
      });
    }

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getCommunities,
  createCommunity,
  joinCommunity,
  getCommunityById,
  searchCommunity
}