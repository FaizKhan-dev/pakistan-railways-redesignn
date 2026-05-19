const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, fullName, cnic, phone } = req.body;

        // Validation - required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username, email, and password are required',
                code: 'MISSING_FIELDS'
            });
        }

        // Validate field lengths
        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                success: false,
                message: 'Username must be 3-30 characters',
                code: 'INVALID_USERNAME'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
                code: 'WEAK_PASSWORD'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address',
                code: 'INVALID_EMAIL'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: existingUser.email === email.toLowerCase() 
                    ? 'Email already registered' 
                    : 'Username already taken',
                code: 'USER_EXISTS'
            });
        }

        // Create new user
        const user = new User({ username, email, password, fullName, cnic, phone });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            code: 'REGISTRATION_SUCCESS',
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                fullName: user.fullName 
            }
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
            message: 'Server error. Please try again later.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required',
                code: 'MISSING_CREDENTIALS'
            });
        }

        // Find user by username or email
        const user = await User.findOne({ $or: [{ username }, { email: username.toLowerCase() }] }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.username}!`,
            code: 'LOGIN_SUCCESS',
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                fullName: user.fullName 
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get current user (requires authentication)
 */
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        res.status(200).json({ 
            success: true, 
            code: 'GET_USER_SUCCESS',
            user 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.',
            code: 'SERVER_ERROR'
        });
    }
};
