const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const chatController = require('../controllers/chatController');


router.post('/send/:recipientId',checkAuth, chatController.sendMessage);

router.get('/messages/:recipientId', checkAuth,chatController.getMessages);

router.get('/inbox',checkAuth, chatController.getInbox);

module.exports = router;