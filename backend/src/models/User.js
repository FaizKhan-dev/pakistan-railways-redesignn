const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Validation patterns
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;  // Format: 12345-1234567-1
const PHONE_REGEX = /^(\+92|0)?[1-9]\d{1,14}$/;  // Pakistani phone
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Standard email

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore, and hyphen']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [EMAIL_REGEX, 'Please enter a valid email address'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false  // Don't include password in queries by default
    },
    fullName: {
        type: String,
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    cnic: {
        type: String,
        trim: true,
        sparse: true,  // Allow null/undefined but enforce uniqueness if present
        match: [CNIC_REGEX, 'CNIC must be in format: 12345-1234567-1']
    },
    phone: {
        type: String,
        trim: true,
        match: [PHONE_REGEX, 'Please enter a valid Pakistani phone number']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Create compound index for efficient queries
userSchema.index({ email: 1, username: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
