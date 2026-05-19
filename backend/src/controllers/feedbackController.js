const Feedback = require('../models/Feedback');

/**
 * Submit feedback
 */
exports.submitFeedback = async (req, res) => {
    try {
        const { email, message, rating } = req.body;

        // Validation - required fields
        if (!email || !message || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, message, and rating are required',
                code: 'MISSING_FIELDS'
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address',
                code: 'INVALID_EMAIL'
            });
        }

        // Validate message length
        if (message.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Message must be at least 5 characters',
                code: 'MESSAGE_TOO_SHORT'
            });
        }

        if (message.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Message cannot exceed 1000 characters',
                code: 'MESSAGE_TOO_LONG'
            });
        }

        // Validate rating
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
                code: 'INVALID_RATING'
            });
        }

        const feedback = new Feedback({ email: email.trim(), message: message.trim(), rating: ratingNum });
        await feedback.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback! We appreciate your input.',
            code: 'FEEDBACK_SUBMITTED',
            feedbackId: feedback._id
        });
    } catch (err) {
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages[0],
                code: 'VALIDATION_ERROR'
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit feedback. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get all feedback (admin only)
 */
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            code: 'GET_FEEDBACK_SUCCESS',
            count: feedbacks.length, 
            feedbacks 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve feedback. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};
