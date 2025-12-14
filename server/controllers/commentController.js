const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')
const Comment = require('../models/Comment.js');
const { CommentBank } = require('@mui/icons-material');

const getPostComments = async (req, res) =>{
    //Button if comment is mine delete
    try{
        const {pid} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const postExists = await Post.exists({_id:pid});
        if(!postExists) return res.status(404).json({message: 'Post Not Exist (CommentController)'});

        const comments = await Comment.find({postID: pid}).sort({createdAt: -1}).skip(skip).limit(limit).populate('userID', 'username image').populate({
            path: 'replies',
            options: {limit: 2, sort: {createdAt: 1}},
            populate: {path: 'userID', select: 'username image'}
        });

        res.status(200).send(comments);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const getCommentReplies = async (req, res) =>{
    try{
        const {coid} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        
        const commentExists = await Comment.exists({_id: coid});
        if(!commentExists) return res.status(404).json({message: "Comment not found"});

        const replies = await Comment.find({parentID:coid})
        .sort({createdAt: 1})
        .skip(skip)
        .limit(limit)
        .populate('userID', 'username image');

        res.status(200).json(replies);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const createComment = async (req, res) =>{
    try{
        const{content, mediaUrl = "", mediaType = "none", postID, parentID} = req.body;
         
        const userID = req.userData.id;

        const postExists = await Post.exists({_id:postID});
        if(!postExists) return res.status(404).json({message: 'Post Not Exist (CommentController)'});

        if(parentID != null){
            const parentExists = await Comment.exists({_id:parentID});
            if(!parentExists) return res.status(404).json({message: 'Post Not Exist (CommentController)'});
        }


        
        const newComment = await Comment.create({
            content,
            mediaUrl,
            mediaType,
            postID,
            userID,
            parentID: parentID || null
        });
        newComment.populate("userID" ,"username image")

        await Post.findByIdAndUpdate(postID, { 
            $inc: { commentCount: 1 } 
        });

        
        if (parentID) {
            
            await Comment.findByIdAndUpdate(parentID, {
                $push: { replies: newComment._id },
                
            });
        } else {
            
            await Post.findByIdAndUpdate(postID, {
                $push: { comments: newComment._id },
                
            });
        }
        res.status(201).json(newComment);

    }catch(error){
        console.log('ahhhh', error.message);
        res.status(500).json({message: error.message});
    }
}


const deleteComment = async (req, res) =>{
    try{
        const {coid} = req.params;
        const uid = req.userData.id;

        const comment = await Comment.findById(coid);
        if(!comment) return res.status(404).json({message: 'Comment not found!'});

        if (comment.userID.toString() !== uid) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Post.findByIdAndUpdate(comment.postID ,{
                $inc: {commentCount: -1}
            } )
        if (comment.parentID) {
            
            await Comment.findByIdAndUpdate(comment.parentID, {
                $pull: { replies: coid },
              
            });
        } else {
            
            await Post.findByIdAndUpdate(comment.postID, {
                $pull: { comments: coid },
                
            });
        }

        await Comment.findByIdAndDelete(coid);

        res.status(200).json({ message: "Comment deleted" });

        
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const upvoteComment = async (req, res) =>{
    try{
        const {coid} = req.params;
        const uid = req.userData.id;
    
        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
            
        const comment = await Comment.findById(coid);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
    
    
        const isUpvoted = comment.upvotes.includes(uid);
        const isDownvoted = comment.downvotes.includes(uid);
            
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



        const comment_u = await Comment.findByIdAndUpdate(coid, updateQuery, { new: true }).populate("userID" , "username")
        res.status(200).json(comment_u);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const editComment = async (req, res)=>{
    try{
        const {coid} = req.params
        const {content, mediaUrl, mediaType} = req.body;
        const uid = req.userData.id;

        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
        
        const comment = await Comment.findById(coid);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }

        if (comment.userID.toString() !== uid) {
            return res.status(403).json({ message: "You are not authorized to edit this comment" });
        }

        const comment_u = await Comment.findByIdAndUpdate(coid,
            {
                
                 
                content, 
                mediaUrl, 
                mediaType
            },
            {new:true}
        );

        res.status(200).json(comment_u);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const downvoteComment = async (req, res) =>{
    try{
        const {coid} = req.params;
        const uid = req.userData.id;
    
        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
            
        const comment = await Comment.findById(coid);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
    
    
        const isUpvoted = comment.upvotes.includes(uid);
        const isDownvoted = comment.downvotes.includes(uid);

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
    
            
        const comment_u = await Comment.findByIdAndUpdate(coid, updateQuery, { new: true }).populate("userID","username");
    
        res.status(200).json(comment_u);
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
}



const awardComment = async (req, res)=>{
    try{
        const {coid} = req.params;
        const {awardName} = req.body;
        const uid = req.userData.id;

        const user = await User.findById(uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        const comment = await Comment.findById(coid);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }


        const post = await Post.findById(comment.postID);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }


        const comm = await Community.findById(post.communityID);
        if(!comm) return res.status(404).json({message: "Community not found"});

        
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

        const comment_u = await Comment.findByIdAndUpdate(coid,
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

        res.status(200).send(comment_u);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}




module.exports = {
    getPostComments,
    getCommentReplies,
    createComment,
    deleteComment,
    editComment,
    upvoteComment,
    downvoteComment,
    awardComment
};