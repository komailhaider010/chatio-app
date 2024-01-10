const express = require('express');
const {createChat, getChat, createGroupChat, updateGroupName, removeFromGroup, addToGroup} = require('../controllers/chatController')
const authenticateUser = require('../middleware/auth');
const router = express.Router();

router.post('/api/chat', authenticateUser, createChat);
router.get('/api/chat', authenticateUser, getChat);
router.post('/api/chat/groupchat', authenticateUser, createGroupChat);
router.put('/api/chat/updategroupname', authenticateUser, updateGroupName);
router.put('/api/chat/removefromgroup', authenticateUser, removeFromGroup);
router.put('/api/chat/addtogroup', authenticateUser, addToGroup);



module.exports = router;