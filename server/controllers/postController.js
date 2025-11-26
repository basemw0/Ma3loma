const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')

const getPostsHomePage = async (req, res) =>{
    try{
        const {uid} = req.params;
        const user = await User.findById(uid).select('joinedCommunities interests');

        if (!user) return res.status(404).json({ message: "User not found" });

        let userCommsIds = user.joinedCommunities.map(jc => jc.community);

        if(user.interests && user.interests.length > 0){
            const interestCommsIds = await Community.distinct('_id', {interests: {$in : user.interests}});

            userCommsIds = Array.from(new Set ([...userCommsIds, ...interestCommsIds]));
        }
        const posts = await Post.find({communityID: {$in: userCommsIds}}).sort({createdAt: -1}).populate('userID', 'username image').populate('communityID', 'name');

        res.status(200).send(posts);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const getPostsCommunity = async (req, res) =>{
    try{
        const {uid, cid} = req.params;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });

        const commExists = await Community.exists({_id:cid});
        if (!commExists) return res.status(404).json({ message: "Community not found" });

        const posts = await Post.find({communityID: cid}).sort({createdAt: -1}).populate('userID', 'username image').populate('communityID', 'name');

        res.status(200).send(posts);
        
        
    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const createPost = async (req, res) =>{
    try{

        const {title, content, mediaUrl, mediaType, userID, communityID} = req.body;

        const newPost = await Post.create({
            title,
            content,
            mediaUrl,
            mediaType,
            userID,
            communityID
        })
        res.status(201).json(newPost);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const deletePost = async (req, res) =>{
    try {
        const { pid, uid } = req.params;

        
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



