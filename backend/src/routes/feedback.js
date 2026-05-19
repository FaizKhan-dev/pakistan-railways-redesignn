const express = require('express');
const { 
    submitFeedback, 
    getAllFeedback 
} = require('../controllers/feedbackController');

const router = express.Router();

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback
 * @access  Public
 */
router.post('/', submitFeedback);

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback (admin only)
 * @access  Public
 */
router.get('/', getAllFeedback);

module.exports = router;
