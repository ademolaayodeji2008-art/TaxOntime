const Contact = require('../models/Contact');
const { sendContactNotification, sendContactConfirmation } = require('../utils/email');

// POST /api/contact — public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, phone, service, message });

    // Fire-and-forget email notifications (don't block the response)
    Promise.all([
      sendContactNotification({ name, email, phone, service, message }),
      sendContactConfirmation({ name, email }),
    ]).catch((err) => console.error('Email notification error:', err.message));

    res.status(201).json({
      message: 'Your message has been sent! We will get back to you within 24–48 hours.',
      id: contact._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/contact — admin only
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, read } = req.query;
    const query = {};
    if (read !== undefined) query.read = read === 'true';

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const unreadCount = await Contact.countDocuments({ read: false });

    res.json({ contacts, total, totalPages: Math.ceil(total / limit), unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/contact/:id/read — admin only
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Marked as read', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/contact/:id — admin only
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitContact, getContacts, markAsRead, deleteContact };
