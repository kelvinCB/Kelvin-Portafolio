const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate, authorize } = require('../middleware/auth');
const { contactFormLimiter, apiLimiter } = require('../middleware/security');

// Public route for sending messages from the contact form
router.post('/', contactFormLimiter, messageController.createMessage);

// Protected routes for the admin panel
router.get('/', authenticate, apiLimiter, messageController.getMessages);
router.get('/export', authenticate, messageController.exportToCSV);
router.get('/:id', authenticate, messageController.getMessage);
router.patch('/:id/read', authenticate, messageController.updateReadStatus);
router.patch('/:id/star', authenticate, messageController.updateStarredStatus);
router.patch('/:id/tags', authenticate, messageController.updateTags);
router.delete('/:id', authenticate, authorize('admin'), messageController.deleteMessage);

module.exports = router;
