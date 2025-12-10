const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')

const getPostsHomePage = async (req, res) =>{
    try{
        
        const uid = req.userData?.id; // Optional - may be undefined if not logged in

        const filter = req.query.filter || 'new'; 
        let sortOption = {};

        if(filter === 'best'){
            sortOption = {voteCount: -1};
        }else if(filter === 'hot'){
            sortOption = {commentCount: -1};
        }else{
            sortOption = {createdAt: -1};
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = 20
        const skip = (page - 1) * limit;

        let query = {}; 

        if (uid) {
            
            const user = await User.findById(uid).select('joinedCommunities interests');
            
            
            if (!user) return res.status(404).json({ message: "User not found" });

            let userCommsIds = user.joinedCommunities.map(jc => jc.community);

            if (user.interests && user.interests.length > 0) {
                const interestCommsIds = await Community.distinct('_id', {
                    interests: { $in: user.interests }
                });
                userCommsIds = Array.from(new Set([...userCommsIds, ...interestCommsIds]));
            }

            
            if (userCommsIds.length > 0) {
                query = { communityID: { $in: userCommsIds } };
            }
            
        }
        // If no user logged in, show all public posts (query is empty {})

        const posts = await Post.find(query)
            .sort(sortOption) 
            .skip(skip)
            .limit(limit)
            .populate('userID', 'username image')
            .populate('communityID', 'name icon');

        res.status(200).send(posts);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const getPostsCommunity = async (req, res) =>{
    try{
        const {cid} = req.params;
        const uid = req.userData?.id; // Optional - may be undefined if not logged in

        const filter = req.query.filter || 'new'; 
        let sortOption = {};

        if(filter === 'best'){
            sortOption = {voteCount: -1};
        }else if(filter === 'hot'){
            sortOption = {commentCount: -1};
        }else{
            sortOption = {createdAt: -1};
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 20
        const skip = (page - 1) * limit;
        if (uid) {
            const userExists = await User.exists({ _id: uid });
            if (!userExists) return res.status(404).json({ message: "User not found" });
        }

        const commExists = await Community.exists({_id:cid});
        if (!commExists) return res.status(404).json({ message: "Community not found" });

        const posts = await Post.find({communityID: cid}).sort(sortOption).skip(skip).limit(limit).populate('userID', 'username image').populate('communityID', 'name icon');

        res.status(200).send(posts);
        
        
    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const getPostDetails = async (req, res) =>{
    try {
        const { pid } = req.params;

        const post = await Post.findById(pid)
            .populate('userID', 'username image')
            .populate('communityID', 'name')
            .populate({
                path: 'comments',
                
                options: { sort: { createdAt: -1 }, limit: 10 }, 
                populate: [
                    
                    { path: 'userID', select: 'username image' },
                    
                    { 
                        path: 'replies', 
                        populate: { path: 'userID', select: 'username image' } 
                    }
                ]
            });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const createPost = async (req, res) =>{
    try{

        const {title, content, mediaUrl, mediaType} = req.body;
        const {communityID} = req.params; 
        const userID =req.userData.id;

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

    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message});
    }
}


const deletePost = async (req, res) =>{
    try {
        const { pid } = req.params;
        const uid =req.userData.id;

        
        const post = await Post.findById(pid);

        if (!post) {
            return res.status(404).json({ message: 'Post Not Found' });
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



const editPost = async (req, res)=>{
    try{
        const {pid} = req.params
        const {title, content, mediaUrl, mediaType} = req.body;
        const uid = req.userData.id;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
        
        const post = await Post.findById(pid);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        if (post.userID.toString() !== uid) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const post_u = await Post.findByIdAndUpdate(pid,
            {
                
                title, 
                content, 
                mediaUrl, 
                mediaType
            },
            {new:true}
        );

        res.status(200).json(post_u);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}



const upvotePost = async (req, res)=>{
    console.log("YOOO")
    try{
        const {pid} = req.params;
        const uid = req.userData.id;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
        
        const post = await Post.findById(pid);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }


        const isUpvoted = post.upvotes.includes(uid);
        const isDownvoted = post.downvotes.includes(uid);

        let updateQuery = {};

        if (isUpvoted) {
            // 1. Already Upvoted -> Remove it (Toggle OFF)
            updateQuery = { 
                $pull: { upvotes: uid },
                $inc: { voteCount: -1 } 
            };
        } else if (isDownvoted) {
            // 2. Was Downvoted -> Switch to Upvote (Big Jump +2)
            updateQuery = { 
                $pull: { downvotes: uid },
                $addToSet: { upvotes: uid },
                $inc: { voteCount: 2 } // +1 to neutralize, +1 to go up
            };
        } else {
            // 3. Neutral -> New Upvote (+1)
            updateQuery = { 
                $addToSet: { upvotes: uid },
                $inc: { voteCount: 1 } 
            };
        }

        
        const post_u = await Post.findByIdAndUpdate(pid, updateQuery, { new: true }).populate("userID" , "username image")
        .populate("communityID" , "name")

        res.status(200).json(post_u);

    }catch(error){
        console.log('el upvote bt3t el post')
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}



const downvotePost = async (req, res)=>{
    console.log("YOOO")

    try{
        const {pid} = req.params;
        const uid = req.userData.id;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
        
        const post = await Post.findById(pid);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }


        const isUpvoted = post.upvotes.includes(uid);
        const isDownvoted = post.downvotes.includes(uid);

        let updateQuery = {};

        if (isDownvoted) {
            // 1. Already Downvoted -> Remove it (Toggle OFF)
            updateQuery = { 
                $pull: { downvotes: uid },
                $inc: { voteCount: 1 } 
            };
        } else if (isUpvoted) {
            // 2. Was Upvoted -> Switch to Downvote (Big Drop -2)
            updateQuery = { 
                $pull: { upvotes: uid },
                $addToSet: { downvotes: uid },
                $inc: { voteCount: -2 } // -1 to neutralize, -1 to go down
            };
        } else {
            // 3. Neutral -> New Downvote (-1)
            updateQuery = { 
                $addToSet: { downvotes: uid },
                $inc: { voteCount: -1 } 
            };
        }

        
       const post_u = await Post.findByIdAndUpdate(pid, updateQuery, { new: true }).populate("userID" , "username image")
        .populate("communityID" , "name")


        res.status(200).json(post_u);

    }catch(error){
        console.log('el downvote bt3t el post')
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}




const awardPost = async (req, res)=>{
    try{
        const cid = "3934d4bf-f5d0-4ae6-b227-809022cd5628"
        const uid = req.userData.id;
        const {awardName} = req.body;

        const user = await User.findById(uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        const comm = await Community.findById(cid);
        if(!comm){
            return res.status(404).json({message: "Community not found"});
        }

        const post = await Post.findById(pid);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        const award = comm.Awards.find(a=> a.name === awardName);
        if(!award){
            return res.status(404).json({message: "Award not found"});
        }

        if(user.goldBalance < award.cost){
            return res.status(404).json({message: "Not Enough Gold"});
        }

        await User.findByIdAndUpdate(uid, 
            {
                $inc: {goldBalance: -award.cost}
            }
        );

        const post_u = await Post.findByIdAndUpdate(pid,
            {
                $push:{
                    awardsReceived: {
                        awardName: award.name,
                        givenBy: uid,
                        givenAt: new Date()
                    }
                }
            },
            {new: true} 
        ).populate('awardsReceived.givenBy', 'username');

        res.status(200).send(post_u);

    }catch(error){
        res.status(500).json({error:error.message});
    }
}



module.exports = {
    getPostsHomePage,
    getPostsCommunity,
    getPostDetails,
    createPost,
    deletePost,
    editPost,
    upvotePost,
    downvotePost,
    awardPost
};