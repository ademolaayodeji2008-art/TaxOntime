const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markAsRead, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', submitContact);

// Admin routes
router.get('/', protect, getContacts);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContact);

module.exports = router;
