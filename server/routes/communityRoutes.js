const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const communityController = require('../controllers/communityController');

const router = express.Router();


router.get('/Category', communityController.getCommunitiesByCategory)

router.get('/search', communityController.searchCommunity)

router.get('/:id', communityController.getCommunityById);
router.get('/best/:limit', communityController.getCommunities);

//router.use(checkAuth);

router.post(
  '/create', 
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Community name is required'),
    
  ],
  communityController.createCommunity
)

router.post(
  '/:id/join',
  [
    check('action')
      .isIn([0, 1])
      .withMessage('Action must be 1 (join) or 0 (leave)')
  ],
  communityController.joinCommunity
);

router.put('/:id/update',communityController.updateCommunity)

module.exports = router;