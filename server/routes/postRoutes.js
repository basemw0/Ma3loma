const express = require('express');
const { check } = require('express-validator');

const checkAuth = require('../middleware/check-auth');


const postController = require('../controllers/postController');



const router = express.Router();


router.get('/home', checkAuth.optionalAuth, postController.getPostsHomePage);


router.get('/community/:cid', checkAuth.optionalAuth, postController.getPostsCommunity);


router.get('/:pid', postController.getPostDetails);

router.use(checkAuth);

router.post('/:communityID/create', postController.createPost);


router.put('/edit/:pid', postController.editPost);


router.delete('/delete/:pid', postController.deletePost);


router.put('/:pid/upvote', postController.upvotePost);
router.put('/:pid/downvote', postController.downvotePost);


router.post('/:pid/award/:cid', postController.awardPost);



module.exports = router;