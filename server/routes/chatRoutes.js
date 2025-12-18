const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const chatController = require('../controllers/chatController');


// Send a message to a specific user (by their User ID)
router.post('/send/:recipientId',checkAuth, chatController.sendMessage);

// Get chat history with a specific user (by their User ID)
router.get('/messages/:recipientId', checkAuth,chatController.getMessages);

// Get my list of conversations
router.get('/inbox',checkAuth, chatController.getInbox);

module.exports = router;