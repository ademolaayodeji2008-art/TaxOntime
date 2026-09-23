const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  getCampaigns,
  sendCampaign,
} = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.get('/unsubscribe', unsubscribe);

// Admin routes
router.get('/subscribers', protect, getSubscribers);
router.get('/campaigns', protect, getCampaigns);
router.post('/send', protect, sendCampaign);

module.exports = router;
