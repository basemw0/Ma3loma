const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment'); 
const Community = require('../models/Community'); 
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


const getCommunities= async (req, res) => {
  const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"

  try {
   
    let communities = await Community.aggregate([
      // {$match:{privacy:{ $in: ["public", "restricted"] }}},
      { $sort: { numberOfMembers: -1 } },
      { $limit: 1000 }
    ]);

    if (!userID) {
      return res.json(communities.map(c => ({
        ...c,
        isMember: false,
        userRole: "guest"
      })));
    }

    const user = await User.findById(userID).select("joinedCommunities");

    if (!user) {
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

    const personalizedCommunities = communities.map(comm => {
      const myRole = userMap[comm._id.toString()]; 
      
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

const getCommunitiesByCategory = async (req, res) => {
  const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"
  const {category}=req.query

  try {
   
    let communities = await Community.aggregate([
      {$match: {
      // privacy: { $in: ["public", "restricted"] },
      interests: category 
    }},
      { $sort: { numberOfMembers: -1 } },
      { $limit: 1000 }
    ]);

    if (!userID) {
      return res.json(communities.map(c => ({
        ...c,
        isMember: false,
        userRole: "guest"
      })));
    }

    const user = await User.findById(userID).select("joinedCommunities");

    if (!user) {
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

    const personalizedCommunities = communities.map(comm => {
      const myRole = userMap[comm._id.toString()]; 
      
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
const { name, description, interests,icon,banner,privacy } = req.body;
const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"
  if (!name || !userID) {
    return res.status(400).json({ message: "Name and UserID are required" });
  }

  try {
    const newCommunity = new Community({
      name,
      description,
      interests: interests || [],
      icon: icon || undefined, 
      banner: banner || undefined,
      privacy:privacy||undefined

      // numberOfMembers defaults to 1
    });

    const savedCommunity = await newCommunity.save();

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

const updateCommunity = async (req, res) => {
  const communityID = req.params.id;
  const { name, description, interests,icon,banner,privacy } = req.body;
  const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"
  if (!communityID || !userID) {
    return res.status(400).json({ message: "communityID and UserID are required" });
  }

  try {
    const user = await User.findById(userID).select("joinedCommunities");
    
    const membership = user.joinedCommunities.find(
      (entry) => entry.community.toString() === communityID
    );

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ message: "Access Denied: You are not an admin of this community." });
    }

    const updateFields = {};
    if (description) updateFields.description = description;
    if (icon) updateFields.icon = icon;
    if (banner) updateFields.banner = banner;
    if (privacyType) updateFields.privacyType = privacyType;
    if (interests) updateFields.interests = interests;

    const updatedCommunity = await Community.findByIdAndUpdate(
      communityID,
      { $set: updateFields },
      { new: true, runValidators: true } 
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json(updatedCommunity);

  } catch (err) {
    // 3. 🚨 HANDLE DUPLICATE NAME ERROR HERE
   
    
    console.error("Error Updating community:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

// ✅ JOIN / LEAVE COMMUNITY (Toggle)
const joinCommunity= async (req, res) => {
  const communityID = req.params.id;
  const {  action } = req.body; 
  const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"
  try {
    let userUpdateResult;

    if (action === 1) {
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

      if (userUpdateResult.modifiedCount > 0) {
        await Community.findByIdAndUpdate(communityID, { $inc: { numberOfMembers: 1 } });
        return res.json({ message: "Successfully joined", isMember: true });
      } else {
        return res.status(400).json({ message: "failed  to join" });
      }

    } else if (action === 0) {
    
      userUpdateResult = await User.updateOne(
        { _id: userID },
        { 
          $pull: { joinedCommunities: { community: communityID } } 
        }
      );

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
  const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"
  try {
    const community = await Community.findById(communityID);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    let isMember = false;
    let userRole = "guest";

    if (userID) {
      const user = await User.findById(userID).select("joinedCommunities");
      
      if (user) {
        const membership = user.joinedCommunities.find(
          (entry) => entry.community.toString() === communityID
        );

        if (membership) {
          isMember = true;
          userRole = membership.role; 
        }
      }
    }

    
    res.json({
      ...community.toObject(),
      isMember,
      userRole
    });

  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid Community ID" });
    }
    res.status(500).send("Server Error");
  }
}


const searchCommunity = async (req, res) => {
  const { query } = req.query;
  const userID =  req.user.id 

  try {
    const userMap = {};
    if (userID) {
      const user = await User.findById(userID).select("joinedCommunities");
      if (user) {
        user.joinedCommunities.forEach(entry => {
          userMap[entry.community.toString()] = entry.role;
        });
      }
    }

    const enhance = (list) => {
      if (!list) return [];
      const arr = Array.isArray(list) ? list : [list];
      return arr.map(comm => {
        const obj = comm.toObject ? comm.toObject() : comm;
        const myRole = userMap[obj._id.toString()];
        return { ...obj, isMember: !!myRole, userRole: myRole || "guest" };
      });
    };

    let excludedIds = [];
    const recommendations = [];

    const exactMatch = await Community.findOne({
      name: { $regex: new RegExp(`^${query}$`, "i") }
    });

    if (exactMatch) {
      excludedIds.push(exactMatch._id);
    }

   
    const substringMatches = await Community.find({
      _id: { $nin: excludedIds },
      name: { $regex: new RegExp(query, "i") }
    }).limit(10);

    recommendations.push(...substringMatches);
    substringMatches.forEach(c => excludedIds.push(c._id));

    if (exactMatch && exactMatch.interests && exactMatch.interests.length > 0) {
      const exactInterestMatches = await Community.find({
        _id: { $nin: excludedIds },
        interests: { $in: exactMatch.interests }
      }).limit(10);

      recommendations.push(...exactInterestMatches);
      exactInterestMatches.forEach(c => excludedIds.push(c._id));
    }


    const substringInterests = substringMatches
      .map(c => c.interests)
      .flat(); // Flatten [[A,B], [B,C]] into [A,B,B,C]
    
    // Remove duplicates from this interest list
    const uniqueSubInterests = [...new Set(substringInterests)];

    if (uniqueSubInterests.length > 0) {
      const subInterestMatches = await Community.find({
        _id: { $nin: excludedIds },
        interests: { $in: uniqueSubInterests }
      }).limit(10);

      recommendations.push(...subInterestMatches);
      subInterestMatches.forEach(c => excludedIds.push(c._id));
    }

    if (userID) {
      const user = await User.findById(userID);
      if (user && user.interests.length > 0) {
        const userInterestMatches = await Community.find({
          _id: { $nin: excludedIds },
          interests: { $in: user.interests }
        }).limit(10);

        recommendations.push(...userInterestMatches);
      }
      else{
       const topCommunities = await Community.aggregate([
      { $sort: { numberOfMembers: -1 } },
      { $limit: 50 }
    ]);
    recommendations.push(...topCommunities);
      }
    }

    return res.json({
      found: !!exactMatch,
      exactMatch: exactMatch ? enhance([exactMatch])[0] : null,
      recommendations: enhance(recommendations)
    });

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
  searchCommunity,
  getCommunitiesByCategory,
  updateCommunity
}