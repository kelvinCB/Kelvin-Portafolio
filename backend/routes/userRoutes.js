const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

// Public routes
// Temporarily removing the rate limiter to avoid errors
router.post('/login', userController.login);

// Protected routes
router.post('/register', authenticate, authorize('admin'), userController.register);
router.get('/profile', authenticate, userController.getProfile);
router.put('/password', authenticate, userController.updatePassword);
router.get('/', authenticate, authorize('admin'), userController.getUsers);

module.exports = router;
