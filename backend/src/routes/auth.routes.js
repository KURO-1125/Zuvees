const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  googleAuth, 
  googleAuthCallback,
  getCurrentUser,
  testLogin
} = require('../controllers/auth.controller');


router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);


router.get('/me', protect, getCurrentUser);

router.post('/test-login', testLogin);

module.exports = router;