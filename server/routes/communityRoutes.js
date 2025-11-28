const express = require('express');
const { check } = require('express-validator');

const communityController = require('../controllers/communityController');

const router = express.Router();

router.get('/', communityController.getCommunities);

router.get('/Category', communityController.getCommunitiesByCategory)

router.get('/search', communityController.searchCommunity)

router.get('/:id', communityController.getCommunityById);

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

module.exports = router;