const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const trainRoutes = require('./routes/trains');
const bookingRoutes = require('./routes/bookings');
const feedbackRoutes = require('./routes/feedback');

// Import utilities
const { seedTrains } = require('./utils/seedData');
const { errorMiddleware } = require('./utils/errorHandler');

const app = express();

// ============================================
// Middleware
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend/public
const frontendPath = path.join(__dirname, '../../frontend/public');
app.use(express.static(frontendPath));

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);

// ============================================
// Root Route
// ============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Handle 404 errors
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use(errorMiddleware);

// ============================================
// Server Startup
// ============================================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Seed initial train data if database is empty
        await seedTrains();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n🚂 Pakistan Railways Server`);
            console.log(`✅ Running at http://localhost:${PORT}`);
            console.log(`📊 Node Environment: ${process.env.NODE_ENV || 'development'}\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
