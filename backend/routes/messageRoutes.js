const express = require('express');
const authenticateUser = require('../middleware/auth');
const { sendMessage, getChatMessages } = require('../controllers/messageController');
const router = express.Router();

router.post('/api/message', authenticateUser, sendMessage );
router.get('/api/message/:chatId', authenticateUser, getChatMessages );




module.exports = router;