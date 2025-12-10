const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const commentController = require('../controllers/commentController');
const router = express.Router();


router.get('/post/:pid', commentController.getPostComments);


router.get('/replies/:coid', commentController.getCommentReplies);


router.use(checkAuth);

router.post('/create',  commentController.createComment);


router.put('/edit/:coid',  commentController.editComment);


router.delete('/:coid',  commentController.deleteComment);



router.put('/:coid/upvote',commentController.upvoteComment);
router.put('/:coid/downvote', commentController.downvoteComment);

router.post('/:coid/award', commentController.awardComment);


module.exports = router;