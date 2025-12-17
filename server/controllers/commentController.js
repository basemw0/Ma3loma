const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')
const Comment = require('../models/Comment.js');

const getPostComments = async (req, res) =>{
    //Button if comment is mine delete
    try{
        const {pid} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const postExists = await Post.exists({_id:pid});
        if(!postExists) return res.status(404).json({message: 'Post Not Exist (CommentController)'});

        const comments = await Comment.find({postID: pid, parentID: null}).sort({createdAt: -1}).skip(skip).limit(limit).populate('userID', 'username image');

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
            if(!parentExists) return res.status(404).json({message: 'Parent Not Exist (CommentController)'});
        }


        
        const newComment = await Comment.create({
            content,
            mediaUrl,
            mediaType,
            postID,
            userID,
            parentID: parentID || null
        });
        await newComment.populate("userID" ,"username image")

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

        

        if (comment.parentID) {
            
            await Comment.findByIdAndUpdate(comment.parentID, {
                $pull: { replies: coid },
              
            });
        } else {
            
            await Post.findByIdAndUpdate(comment.postID, {
                $pull: { comments: coid },
                
            });
        }

        await Comment.findOneAndDelete({ _id: coid });

        const newCount = await Comment.countDocuments({ postID: comment.postID });
        await Post.findByIdAndUpdate(comment.postID, { commentCount: newCount });

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



        const comment_u = await Comment.findOneAndUpdate({_id:coid}, updateQuery, { new: true }).populate("userID","username image");
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
            {new:true,
                runValidators: true
            }
        ).populate("userID","username image");

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
    
            
        const comment_u = await Comment.findOneAndUpdate({_id:coid}, updateQuery, { new: true }).populate("userID","username image");
    
        res.status(200).json(comment_u);
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
}



const awardComment = async (req, res)=>{
    try{
        const {coid, awardName} = req.params;
        
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
            console.log('mfe4 flos 2')
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
        ).populate("userID", "username image").populate('awardsReceived.givenBy', 'username');

        console.log('aywa b2a 2');

        res.status(200).send(comment_u);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const searchComments = async (req, res) => {
    try {
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!q) return res.status(400).json({ message: "Query required" });

        const searchRegex = new RegExp(q, "i");

        // 1. Find matching comments
        const matchingComments = await Comment.find({ content: { $regex: searchRegex } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userID', 'username image') // Comment Author
            // 2. Populate the entire Post Structure
            .populate({
                path: 'postID',
                select: 'title content voteCount createdAt mediaUrl mediaType communityID userID',
                populate: [
                    { path: 'communityID', select: 'name icon' },
                    { path: 'userID', select: 'username image' } // Post Author
                ]
            });

        // 3. Format Response
        const results = matchingComments
            .filter(c => c.postID) // Filter out if post was deleted (orphans)
            .map(c => {
                const commentObj = c.toObject();
                const postObj = commentObj.postID; // Extract full post
                
                // Optional: Clean up recursive reference
                delete commentObj.postID;

                return {
                    post: postObj,          // The Whole Post Object
                    matchedComment: commentObj // The Specific Comment
                };
            });
        console.log(results)
        res.status(200).json(results);

    } catch (error) {
        console.error("Search Comment Error", error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getPostComments,
    getCommentReplies,
    createComment,
    deleteComment,
    editComment,
    upvoteComment,
    downvoteComment,
    awardComment,
    searchComments
};