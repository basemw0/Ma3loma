const express = require('express');
const { check } = require('express-validator');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const checkAuth = require('../middleware/checkAuth'); // Ensure you have this middleware to check authentication

const router = express.Router();

// Get posts for the homepage (assuming home page fetches all posts)
router.get('/home', postController.getPostsHomePage);

// Get posts for a specific community
router.get('/community/:cid', postController.getPostsCommunity);

// Get post details by post ID
router.get('/:pid', postController.getPostDetails);

// Ensure user is authenticated for the following routes
router.use(checkAuth);

// **Create Post** - Route to create a new post
router.post('/create', postController.createPost);

// **Edit Post** - Route to edit an existing post
router.put('/edit/:pid', postController.editPost);

// **Delete Post** - Route to delete a post
router.delete('/delete/:pid', postController.deletePost);

// **Upvote Post** - Route to upvote a post
router.put('/:pid/upvote', postController.upvotePost);

// **Downvote Post** - Route to downvote a post
router.put('/:pid/downvote', postController.downvotePost);

// **Award Post** - Route to award a post with some reward (e.g. gold)
router.post('/:pid/award/:cid', postController.awardPost);

// **Get Comments for a Post** - Route to fetch all comments for a specific post
router.get('/:pid/comments', commentController.getPostComments);

// **Create Comment** - Route to create a new comment on a post
router.post('/:pid/comment', commentController.createComment);

// **Upvote Comment** - Route to upvote a specific comment
router.put('/comment/:coid/upvote', commentController.upvoteComment);

// **Downvote Comment** - Route to downvote a specific comment
router.put('/comment/:coid/downvote', commentController.downvoteComment);

// **Edit Comment** - Route to edit a specific comment
router.put('/comment/:coid/edit', commentController.editComment);

// **Delete Comment** - Route to delete a specific comment
router.delete('/comment/:coid', commentController.deleteComment);

// **Award Comment** - Route to award a comment with a reward (e.g. gold)
router.post('/comment/:coid/award/:cid', commentController.awardComment);

module.exports = router;
