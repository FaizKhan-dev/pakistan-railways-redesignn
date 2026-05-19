const express = require('express');
const { 
    createBooking, 
    getBookingByPNR, 
    getAllBookings 
} = require('../controllers/bookingsController');

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Public
 */
router.post('/', createBooking);

/**
 * @route   GET /api/bookings/:pnr
 * @desc    Get booking by PNR number
 * @access  Public
 */
router.get('/:pnr', getBookingByPNR);

module.exports = router;
