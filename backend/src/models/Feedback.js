const mongoose = require('mongoose');

// Validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [EMAIL_REGEX, 'Please enter a valid email address'],
        index: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [5, 'Message must be at least 5 characters'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        enum: [1, 2, 3, 4, 5]
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Create index for efficient queries
feedbackSchema.index({ rating: 1, submittedAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
