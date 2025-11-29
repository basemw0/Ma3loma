const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Community = require('../models/Community.js')
const Comment = require('../models/Comment.js');


/*
const getPostComments = async (req, res) =>{
    try{
        const {pid} = req.params;

        const postExists = await Post.exists({_id:pid});
        if(!postExists) return res.status(404).json({message: 'Post Not Exist (CommentController)'});

        const comments = await Comment.find({postID: pid}).sort({createdAt: -1}).populate('userID', 'username image');

        res.status(200).send(comments);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}
*/
// fy 7aga fy el tafkeer

const createComment = async (req, res) =>{
    try{
        const{content, mediaUrl, mediaType, postID} = req.body; 
        const userID = "4c740372-7c91-4bc2-945c-58a7ee0109b5"

        const postExists = await Post.exists({_id:postID});
        if(!postExists) return res.status(404).json({message: 'Post Not Exist (CommentController)'});

        const newComment = await Comment.create({
            content,
            mediaUrl,
            mediaType,
            postID,
            userID
        });

        await Post.findByIdAndUpdate(postID,{
            $push:{
                comments: newComment._id
            }
        });

        res.status(201).json(newComment);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const deleteComment = async (req, res) =>{
    try{
        const {coid} = req.params;
        const uid = req.user.id;

        const comment = await Comment.findById(coid);
        if(!comment) return res.status(404).json({message: 'Comment not found!'});

        if (comment.userID.toString() !== uid) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Post.findByIdAndUpdate(comment.postID, {
            $pull: { comments: coid }
        });

        await Comment.findByIdAndDelete(coid);

        res.status(200).json({ message: "Comment deleted" });

        
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const upvoteComment = async (req, res) =>{
    try{
        const {coid} = req.params;
        const uid = req.user.id;
    
        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
            
        const comment = await Comment.findById(coid);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
    
    
        const isUp = comment.upvotes.includes(uid);
            
        let updateQuery = {};
    
        if (isUp) {
                
            updateQuery = { $pull: { upvotes: uid } };
        } else {
                
            updateQuery = { 
                $addToSet: { upvotes: uid }, 
                $pull: { downvotes: uid }    
            };
        }
    
            
        const comment_u = await Comment.findByIdAndUpdate(coid, updateQuery, { new: true });
    
        res.status(200).json(comment_u);
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const downvoteComment = async (req, res) =>{
    try{
        const {coid} = req.params;
        const uid = req.user.id;
    
        const userExists = await User.exists({_id:uid});
        if (!userExists) return res.status(404).json({ message: "User not found" });
            
        const comment = await Comment.findById(coid);
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
    
    
        const isDown = comment.downvotes.includes(uid);
            
        let updateQuery = {};
    
        if (isDown) {
                
            updateQuery = { $pull: { downvotes: uid } };
        } else {
                
            updateQuery = { 
                $addToSet: { downvotes: uid }, 
                $pull: { upvotes: uid }    
            };
        }
    
            
        const comment_u = await Comment.findByIdAndUpdate(coid, updateQuery, { new: true });
    
        res.status(200).json(comment_u);
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
}



const awardComment = async (req, res)=>{
    try{
        const {coid} = req.params;
        const {awardName} = req.body;
        const uid = req.user.id;

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
        res.status(500).json({error:error.message});
    }
}




module.exports = {
    createComment,
    deleteComment,
    upvoteComment,
    downvoteComment,
    awardComment
};