const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback
router.post('/', async (req, res) => {
    try {
        const { email, message, rating } = req.body;

        if (!email || !message || !rating) {
            return res.status(400).json({ success: false, message: 'Email, message, and rating are required' });
        }

        const feedback = new Feedback({ email, message, rating });
        await feedback.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback! We appreciate your input.'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// GET /api/feedback — get all feedback (admin use)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
        res.json({ success: true, count: feedbacks.length, feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

module.exports = router;
