const express = require('express');
const { signupUser, loginUser, getAllUser, currentUser } = require('../controllers/userController');
const authenticateUser = require('../middleware/auth');
const router = express.Router();


router.post('/api/user/signup', signupUser )
router.post('/api/user/login', loginUser )
router.get('/api/user', authenticateUser, getAllUser )
router.get('/api/currentuser', authenticateUser, currentUser )

module.exports = router;