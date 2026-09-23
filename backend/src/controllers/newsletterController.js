const crypto = require('crypto');
const { Subscriber, NewsletterCampaign } = require('../models/Newsletter');
const { sendNewsletter } = require('../utils/email');

// POST /api/newsletter/subscribe — public
const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.status(400).json({ message: 'This email is already subscribed.' });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    await Subscriber.create({ email, name: name || '', unsubscribeToken });

    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/newsletter/unsubscribe?token=xxx — public
const unsubscribe = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Invalid unsubscribe link' });

    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    if (!subscriber) return res.status(404).json({ message: 'Subscriber not found' });

    subscriber.active = false;
    await subscriber.save();

    res.json({ message: 'You have been successfully unsubscribed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/newsletter/subscribers — admin only
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ active: true }).sort({ createdAt: -1 });
    res.json({ subscribers, total: subscribers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/newsletter/campaigns — admin only
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await NewsletterCampaign.find()
      .sort({ createdAt: -1 })
      .populate('sentBy', 'name');
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/newsletter/send — admin only
const sendCampaign = async (req, res) => {
  try {
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ message: 'Subject and body are required' });
    }

    const subscribers = await Subscriber.find({ active: true });
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers to send to.' });
    }

    // Create campaign record
    const campaign = await NewsletterCampaign.create({
      subject,
      body,
      status: 'draft',
      sentBy: req.user._id,
    });

    // Send emails
    const results = await sendNewsletter({ subscribers, subject, body });

    // Update campaign record
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    campaign.recipientCount = results.success;
    await campaign.save();

    res.json({
      message: `Newsletter sent to ${results.success} subscriber(s). ${results.failed} failed.`,
      campaign,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { subscribe, unsubscribe, getSubscribers, getCampaigns, sendCampaign };
