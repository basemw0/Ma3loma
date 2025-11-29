const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')

const getPostsHomePage = async (req, res) =>{
    try{
        
        const uid = req.user ? req.user.id : null; 

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

        
        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate('userID', 'username image')
            .populate('communityID', 'name');

        res.status(200).send(posts);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const getPostsCommunity = async (req, res) =>{
    try{
        const {cid} = req.params;
        const uid = req.user ? req.user.id : null; 

        
        if (uid) {
            const userExists = await User.exists({ _id: uid });
            if (!userExists) return res.status(404).json({ message: "User not found" });
        }

        const commExists = await Community.exists({_id:cid});
        if (!commExists) return res.status(404).json({ message: "Community not found" });

        const posts = await Post.find({communityID: cid}).sort({createdAt: -1}).populate('userID', 'username image').populate('communityID', 'name');

        res.status(200).send(posts);
        
        
    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const getPostDetails = async (req, res) =>{
    try {
        const { pid } = req.params;

        const post = await Post.findById(pid)
            .populate({
                path: 'comments', 
                populate: { path: 'userID', select: 'username image' } 
            });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const createPost = async (req, res) =>{
    try{

        const {title, content, mediaUrl, mediaType, communityID} = req.body;
        const userID = req.user.id;

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
        const { pid } = req.params;
        const uid = req.user.id;

        
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
        const uid = req.user.id;

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
    try{
        const {pid} = req.params;
        const uid = req.user.id;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
        
        const post = await Post.findById(pid);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }


        const isUp = post.upvotes.includes(uid);
        
        let updateQuery = {};

        if (isUp) {
            
            updateQuery = { $pull: { upvotes: uid } };
        } else {
            
            updateQuery = { 
                $addToSet: { upvotes: uid }, 
                $pull: { downvotes: uid }    
            };
        }

        
        const post_u = await Post.findByIdAndUpdate(pid, updateQuery, { new: true });

        res.status(200).json(post_u);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}



const downvotePost = async (req, res)=>{
    try{
        const {pid} = req.params;
        const uid = req.user.id;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
        
        const post = await Post.findById(pid);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }


        const isDown = post.downvotes.includes(uid);
        
        let updateQuery = {};

        if (isDown) {
            
            updateQuery = { $pull: { downvotes: uid } };
        } else {
            
            updateQuery = { 
                $addToSet: { downvotes: uid }, 
                $pull: { upvotes: uid }    
            };
        }

        
        const post_u = await Post.findByIdAndUpdate(pid, updateQuery, { new: true });

        res.status(200).json(post_u);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}




const awardPost = async (req, res)=>{
    try{
        const {pid, cid} = req.params;
        const {awardName} = req.body;
        const uid = req.user.id;

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
