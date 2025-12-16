const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment'); 
const Community = require('../models/Community'); 
const ALLOWED_INTERESTS = require("../config/interests"); 
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');


const getCommunities= async (req, res) => {
  const userID = req.userData?.id; // Get from check-auth middleware (optional, used for personalization)
  const limit = req.params.limit;


  try {
    // 1. ✅ Get the total count of communities in the DB
    const totalDocs = await Community.countDocuments({});

    // 2. Run your specific aggregation for pagination
    let communities = await Community.aggregate([
      // {$match:{privacy:{ $in: ["public", "restricted"] }}},
      { $sort: { numberOfMembers: -1 } },
      { $skip: 25 * (limit - 1) },
      { $limit: 25 }
    ]);

    // Helper function to format the response consistently
    const formatResponse = (list) => {
      return {
        total: totalDocs, // <--- Sending total count here
        communities: list
      };
    };

    if (!userID) {
      const guestCommunities = communities.map(c => ({
        ...c,
        isMember: false,
        userRole: "guest"
      }));
      return res.json(formatResponse(guestCommunities));
    }

    const user = await User.findById(userID).select("joinedCommunities");

    if (!user) {
      const guestCommunities = communities.map(c => ({
        ...c,
        isMember: false,
        userRole: "guest"
      }));
      return res.json(formatResponse(guestCommunities));
    }

    const userMap = {};
    user.joinedCommunities.forEach(entry => {
      userMap[entry.community.toString()] = entry.role;
    });

    const personalizedCommunities = communities.map(comm => {
      const myRole = userMap[comm._id.toString()];

      return {
        ...comm,
        isMember: !!myRole,
        userRole: myRole || "guest"
      };
    });

    // 3. ✅ Send final response with total count
    res.json(formatResponse(personalizedCommunities));

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


const getCommunitiesByCategory = async (req, res) => {
  const userID = req.userData?.id; // Get from check-auth middleware (optional)
  const { q } = req.query; 

  try {
    let categoryData
    if (q==="All"){ categoryData= ALLOWED_INTERESTS}
    else  categoryData = ALLOWED_INTERESTS.find(cat => cat.name === q);

    if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }
    let targetTopics
    if(q === "All"){
      targetTopics = categoryData.flatMap(c => c.topics);
    }
    else{
      targetTopics = categoryData.topics
    }
    const groupedCommunities = await Community.aggregate([
      { 
        $match: { 
          
          interests: { $in: targetTopics },
          // privacy: { $in: ["public", "restricted"] } // Optional based on your previous code
        } 
      },
      // Unwind allows us to duplicate the community for each interest it has
      { $unwind: "$interests" },
      { 
        $match: { 
          // Filter again so we only group by the topics belonging to THIS category
          // (Removes "Cooking" interest if we are currently looking at "Gaming" category)
          interests: { $in: targetTopics }
        } 
      },
      { $sort: { numberOfMembers: -1 } },
      {
        $group: {
          _id: "$interests",
          communities: { $push: "$$ROOT" } 
        }
      },
      {
        $project: {
          topic: "$_id",
          communities: { $slice: ["$communities", 10] }, 
          _id: 0
        }
      }
    ]);

    let userMap = {};
    
    if (userID) {
      const user = await User.findById(userID).select("joinedCommunities");
      if (user && user.joinedCommunities) {
        user.joinedCommunities.forEach(entry => {
          userMap[entry.community.toString()] = entry.role;
        });
      }
    }

    
    const result = groupedCommunities.map(group => {
      const personalized = group.communities.map(comm => {
        const myRole = userMap[comm._id.toString()]; 
        
        return {
          ...comm,
          isMember: !!myRole,
          userRole: myRole || "guest"
        };
      });

      return {
        topic: group.topic,
        communities: personalized
      };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
// ✅ CREATE COMMUNITY ENDPOINT
const createCommunity = async (req, res) => {
const { name, description, interests,icon,banner,privacy } = req.body;
 const cid = req.params.id
  const userID = req.userData.id
  let owner = userID
  if (!name || !userID) {
    return res.status(400).json({ message: "Name and UserID are required" });
  }

  try {
    const newCommunity = new Community({
      name,
      description,
      owner,
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
  const { name, description, interests,icon,banner,privacy } = req.body;
   const communityID =req.params.id
  const userID =req.userData.id
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
  const communityID = req.params.id
  const userID =req.userData.id
  const { action } = req.body; 
  console.log(communityID)
  const community = await Community.findById(communityID)
  console.log("🔥 JOIN ROUTE HIT");

  try {
    let userUpdateResult;

    if (action == 1) {
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

    } else if (action == 0) {
    
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
   const communityID = req.params.id
   const userID = req.userData?.id;
  try {
    const community = await Community.findById(communityID).populate({
      path: "moderators.user",   
      select: "username image goldBalance _id"
    });

    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    let isMember = false;
    let userRole = "guest";
    let isOwner = community.owner === userID

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
      userRole,
      isOwner
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
  const { q } = req.query;
  const userID = req.userData.id

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
      name: q
    });

    if (exactMatch) {
      excludedIds.push(exactMatch._id);
    }

   
    const substringMatches = await Community.find({
      _id: { $nin: excludedIds },
      name: { $regex: new RegExp(q, "i") }
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
const deleteCommunity = async (req , res)=>{
  try{
  const communityID = req.params.id
  const userID = req.userData.id
  const community = await Community.findById(communityID)
  console.log("AH")
  if(community && userID){
    if(community.owner){
    if(community.owner === userID){
    console.log("WEE")
     await Community.findByIdAndDelete(communityID)
     console.log("Yo")
    }}
    else{
      console.log("DOESNT EXIST")
    }
  }
}catch(e){
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
  updateCommunity,
  deleteCommunity
}