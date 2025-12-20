const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const summarizePost = async (req, res) => {
    try {
        const { pid } = req.params;

        const post = await Post.findById(pid);
        if (!post) {
            return res.status(404).json({ message: 'Post Not Found' });
        }

        if (!post.content || post.content.length < 50) {
            return res.status(400).json({ message: 'Post content is too short to summarize.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Summarize the following Reddit post in a concise, bulleted format (maximum 3 bullet points). 
        
        Title: ${post.title}
        Content: ${post.content}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const summaryText = response.text();

        res.status(200).json({ summary: summaryText });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to generate summary. " + error.message });
    }
};


//pid = '6c251380-9dec-4e98-9821-91d06f2c3234'
//cid = '18c1130b-b3e2-47fd-91d9-70ee3cc5c797'
//uid = '66f5a632-afd0-4fde-8ea3-e0b87caa780e'


const getPostsHomePage = async (req, res) => {
    try {
        const uid = req.userData?.id;

        const filter = req.query.filter || "best";
        let sortOption = {};

        if (filter === "best") sortOption = { voteCount: -1 };
        else if (filter === "hot") sortOption = { commentCount: -1 };
        else sortOption = { createdAt: -1 };

        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;


        if (!uid) {
            const posts = await Post.find({})
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .populate("userID", "username image")
                .populate("communityID", "name icon")
                .lean();

            return res.status(200).json(
                posts.map(p => ({
                    ...p,
                    isMember: false,
                    isSaved: false
                }))
            );
        }


        const user = await User.findById(uid).select(
            "joinedCommunities interests savedPosts"
        );

        if (!user)
            return res.status(404).json({ message: "User not found" });

        const joinedIds = user.joinedCommunities.map(jc =>
            jc.community.toString()
        );

        let interestIds = [];
        if (user.interests?.length) {
            const ids = await Community.distinct("_id", {
                interests: { $in: user.interests }
            });
            interestIds = ids.map(id => id.toString());
        }

        const priorityIds = Array.from(
            new Set([...joinedIds, ...interestIds])
        );

        
        const posts = await Post.aggregate([
            {
                $addFields: {
                    priority: {
                        $switch: {
                            branches: [
                                { case: { $in: ["$communityID", joinedIds] }, then: 2 },
                                { case: { $in: ["$communityID", interestIds] }, then: 1 }
                            ],
                            default: 0
                        }
                    }
                }
            },
            {
                $sort: {
                    priority: -1,
                    ...sortOption
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);


        await Post.populate(posts, [
            { path: "userID", select: "username image" },
            { path: "communityID", select: "name icon" }
        ]);

        const finalPosts = posts.map(post => ({
            ...post,
            isMember: joinedIds.includes(post.communityID._id.toString()),
            isSaved: user.savedPosts.includes(post._id.toString())
        }));

        res.status(200).json(finalPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};


const getPostsCommunity = async (req, res) => {
    try {
        const { cid } = req.params;
        const uid = req.userData?.id; 

        const filter = req.query.filter || 'new';
        let sortOption = {};

        if (filter === 'best') {
            sortOption = { voteCount: -1 };
        } else if (filter === 'hot') {
            sortOption = { commentCount: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 20
        const skip = (page - 1) * limit;


        const commExists = await Community.exists({ _id: cid });
        if (!commExists) return res.status(404).json({ message: "Community not found" });

        let posts = [];
        const buffedPosts = [];


        posts = await Post.find({ communityID: cid })
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('userID', 'username image')
            .populate('communityID', 'name icon')
            .lean();

        if (uid) {
            const user = await User.findById(uid).select('joinedCommunities savedPosts');
            if (!user) return res.status(404).json({ message: "User not found" });

            let userCommsIds = user.joinedCommunities.map(jc => jc.community.toString());


            posts.forEach(post => {
                buffedPosts.push({ ...post, isMember: userCommsIds.includes(post.communityID._id.toString()), isSaved: user.savedPosts.includes(post._id.toString()) });
            });


        } else {

            posts.forEach(post => {
                buffedPosts.push({ ...post, isMember: false, isSaved: false });
            });
        }

        res.status(200).send(buffedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getPostDetails = async (req, res) => {
    try {
        const { pid } = req.params;

        const post = await Post.findById(pid)
            .populate('userID', 'username image')
            .populate('communityID', 'name moderators');

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createPost = async (req, res) => {
    try {

        const { title, content, mediaUrl, mediaType } = req.body;
        const { communityID } = req.params;
        const userID = req.userData.id;

        //cid = d17b1418-f818-4af8-b8cc-3202e5b43f93

        const newPost = await Post.create({
            title,
            content,
            mediaUrl,
            mediaType,
            userID,
            communityID
        })
        await newPost.populate('userID', 'username image');
        res.status(201).json(newPost);

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}


const deletePost = async (req, res) => {
    try {
        const { pid } = req.params;
        const uid = req.userData.id;
        console.log(uid)


        const post = await Post.findById(pid);

        if (!post) {
            return res.status(404).json({ message: 'Post Not Found' });
        }


        const comm = await Community.findById(post.communityID);

        if(!comm){
            return res.status(404).json({message: 'Community Not Found'});
        }
        console.log(comm.moderators)
        if(comm.moderators.find((mod)=> mod.user === uid)){
            console.log("ANA MODERATOR")
            const p = await Post.findByIdAndDelete(pid);
            return res.status(200).json({ message: 'Post deleted successfully!' });
            
        }

        if (post.userID.toString() !== uid) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const p = await Post.findByIdAndDelete(pid);

        res.status(200).json({ message: 'Post deleted successfully!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const editPost = async (req, res) => {
    try {
        const { pid } = req.params
        const { title, content, mediaUrl, mediaType } = req.body;
        const uid = req.userData.id;

        const userExists = await User.exists({ _id: uid });
        if (!userExists) return res.status(404).json({ message: "User not found" });

        const post = await Post.findById(pid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userID.toString() !== uid) {
            return res.status(403).json({ message: "You are not authorized to edit this post" });
        }

        const post_u = await Post.findByIdAndUpdate(pid,
            {

                title,
                content,
                mediaUrl,
                mediaType
            },
            { new: true,
                runValidators: true
             }
        );

        res.status(200).json(post_u);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const upvotePost = async (req, res) => {
    console.log("YOOO")
    try {
        const { pid } = req.params;
        const uid = req.userData.id;


        const userExists = await User.exists({ _id: uid });
        if (!userExists) return res.status(404).json({ message: "User not found" });

        const post = await Post.findById(pid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }


        const isUpvoted = post.upvotes.includes(uid);
        const isDownvoted = post.downvotes.includes(uid);

        let updateQuery = {};

        if (isUpvoted) {
            updateQuery = {
                $pull: { upvotes: uid },
                $inc: { voteCount: -1 }
            };
        } else if (isDownvoted) {
            updateQuery = {
                $pull: { downvotes: uid },
                $addToSet: { upvotes: uid },
                $inc: { voteCount: 2 } 
            };
        } else {
            updateQuery = {
                $addToSet: { upvotes: uid },
                $inc: { voteCount: 1 }
            };
        }


        const post_u = await Post.findOneAndUpdate({_id: pid}, updateQuery, { new: true }).populate("userID", "username image")
            .populate("communityID", "name")

        res.status(200).json(post_u);

    } catch (error) {
        console.log('el upvote bt3t el post')
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}



const downvotePost = async (req, res) => {
    console.log("YOOO")

    try {
        const { pid } = req.params;
        const uid = req.userData.id;

        const userExists = await User.exists({ _id: uid });
        if (!userExists) return res.status(404).json({ message: "User not found" });

        const post = await Post.findById(pid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }


        const isUpvoted = post.upvotes.includes(uid);
        const isDownvoted = post.downvotes.includes(uid);

        let updateQuery = {};

        if (isDownvoted) {
            
            updateQuery = {
                $pull: { downvotes: uid },
                $inc: { voteCount: 1 }
            };
        } else if (isUpvoted) {
            
            updateQuery = {
                $pull: { upvotes: uid },
                $addToSet: { downvotes: uid },
                $inc: { voteCount: -2 } 
            };
        } else {
            
            updateQuery = {
                $addToSet: { downvotes: uid },
                $inc: { voteCount: -1 }
            };
        }


        const post_u = await Post.findOneAndUpdate({_id: pid}, updateQuery, { new: true }).populate("userID", "username image")
            .populate("communityID", "name")


        res.status(200).json(post_u);

    } catch (error) {
        console.log('el downvote bt3t el post')
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}




const awardPost = async (req, res) => {
    try {
        
        const uid = req.userData.id;
        const { pid, awardName } = req.params;

        const user = await User.findById(uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        const post = await Post.findById(pid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comm = await Community.findById(post.communityID);
        if (!comm) {
            return res.status(404).json({ message: "Community not found" });
        }

        

        const award = comm.Awards.find(a => a.name === awardName);
        if (!award) {
            return res.status(404).json({ message: "Award not found" });
        }

        if (user.goldBalance < award.cost) {
            console.log('mfe4 flos');
            return res.status(404).json({ message: "Not Enough Gold" });
        }

        await User.findByIdAndUpdate(uid,
            {
                $inc: { goldBalance: -award.cost }
            }
        );

        const post_u = await Post.findByIdAndUpdate(pid,
            {
                $push: {
                    awardsReceived: {
                        awardName: award.name,
                        givenBy: uid,
                        givenAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate("userID", "username image").populate("communityID", "name").populate('awardsReceived.givenBy', 'username');

        console.log("aywa b2a")

        res.status(200).send(post_u);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const savePost = async (req, res) => {
    try {
        const { pid } = req.params;
        const uid = req.userData.id;

        const user = await User.findById(uid);
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log('awel check tmm');

        const postExists = await Post.exists({ _id: pid });
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }
        console.log('tany check tmm');

        const isSaved = user.savedPosts.includes(pid);
        let updateQuery = {};
        let msg = "";

        if (isSaved) {

            updateQuery = { $pull: { savedPosts: pid } };
            msg = "Post unsaved successfully";
        } else {
            updateQuery = { $addToSet: { savedPosts: pid } };
            msg = "Post saved successfully";
        }

        await User.findByIdAndUpdate(uid, updateQuery, {new: true});

        console.log('hena aho');

        res.status(200).json({ message: msg });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getSavedPosts = async (req, res) => {
    try {
        const uid = req.userData.id;

        const filter = req.query.filter || "best";
        let sortOption = {};

        if (filter === "best") sortOption = { voteCount: -1 };
        else if (filter === "hot") sortOption = { commentCount: -1 };
        else sortOption = { createdAt: -1 };

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;



        const user = await User.findById(uid).populate({
            path: 'savedPosts',
            options: {skip: skip, limit: limit, sort: sortOption},
            populate: [
                { path: 'userID', select: 'username image' },
                { path: 'communityID', select: 'name icon' }
            ]
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const joinedIds = user.joinedCommunities.map(jc =>
            jc.community.toString()
        );
       

        const posts = user.savedPosts.map(post => ({
            ...post.toObject(),
            isSaved: true,
            isMember: joinedIds.includes(post.communityID._id.toString())
        }));
       

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const searchPosts = async (req, res) => {
  const { q } = req.query;

  const filter = req.query.filter || "best";
    let sortOption = {};

    if (filter === "best") sortOption = { voteCount: -1 };
    else if (filter === "hot") sortOption = { commentCount: -1 };
    else sortOption = { createdAt: -1 };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userID = req.userData?.id; 

  try {
    const results = [];
    let excludedIds = [];

    
    const searchRegex = new RegExp(q, "i");
    
    const directMatches = await Post.find({
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } }
      ]
    })
    .sort(sortOption) 
    .skip(skip)      
    .limit(limit)    
    .populate('userID', 'username image')
    .populate('communityID', 'name icon');

    results.push(...directMatches);
    directMatches.forEach(p => excludedIds.push(p._id));

    
    if (page === 1 && results.length < limit) {
        
        const remainingLimit = limit - results.length;

        
        const matchedCommunities = await Community.find({ name: { $regex: searchRegex } }).select('_id');
        
        if (matchedCommunities.length > 0) {
            const commIds = matchedCommunities.map(c => c._id);
            const communityPosts = await Post.find({
                _id: { $nin: excludedIds },
                communityID: { $in: commIds }
            })
            .sort(sortOption)
            .limit(remainingLimit) // Only fill what's left
            .populate('userID', 'username image')
            .populate('communityID', 'name icon');

            results.push(...communityPosts);
            communityPosts.forEach(p => excludedIds.push(p._id));
        }
    }

    
    if (results.length > 0 && userID) {
        const user = await User.findById(userID).select("joinedCommunities savedPosts");
        if (user) {
            const joinedSet = new Set(user.joinedCommunities.map(jc => jc.community.toString()));
            const savedSet = new Set(user.savedPosts.map(sp => sp.toString()));

            
            const finalResults = results.map(post => {
                const obj = post.toObject ? post.toObject() : post;
                const commId = obj.communityID?._id?.toString() || obj.communityID?.toString();
                return {
                    ...obj,
                    isMember: commId ? joinedSet.has(commId) : false,
                    isSaved: savedSet.has(obj._id.toString())
                };
            });
            return res.json(finalResults);
        }
    }

    
    return res.json(results.map(r => r.toObject ? r.toObject() : r));

  } catch (err) {
    console.error("Search Posts Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


const getPostsByUser = async (req, res) => {
    try {
        const { uid } = req.params; 
        const currentUserId = req.userData?.id; 

        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const filter = req.query.filter || 'new';
        let sortOption = { createdAt: -1 };
        
        if (filter === 'best') sortOption = { voteCount: -1 };
        if (filter === 'hot') sortOption = { commentCount: -1 };

        const posts = await Post.find({ userID: uid })
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('userID', 'username image')
            .populate('communityID', 'name icon')
            .lean();

        if (currentUserId) {
            const currentUser = await User.findById(currentUserId).select('joinedCommunities savedPosts');
            
            if (currentUser) {
                const joinedSet = new Set(currentUser.joinedCommunities.map(jc => jc.community.toString()));
                const savedSet = new Set(currentUser.savedPosts.map(s => s.toString()));

                const buffedPosts = posts.map(post => ({
                    ...post,
                    isMember: post.communityID ? joinedSet.has(post.communityID._id.toString()) : false,
                    isSaved: savedSet.has(post._id.toString())
                }));
                
                return res.status(200).json(buffedPosts);
            }
        }

        const guestPosts = posts.map(post => ({
            ...post,
            isMember: false,
            isSaved: false
        }));

        res.status(200).json(guestPosts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getPostsHomePage,
    getPostsCommunity,
    getPostDetails,
    createPost,
    deletePost,
    editPost,
    upvotePost,
    downvotePost,
    awardPost,
    summarizePost,
    savePost,
    getSavedPosts,
    searchPosts,
    getPostsByUser
};