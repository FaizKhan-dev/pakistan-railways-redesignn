const Booking = require('../models/Booking');
const Train = require('../models/Train');

/**
 * Create a new booking
 */
exports.createBooking = async (req, res) => {
    try {
        const {
            passengerName, passengerCnic, passengerEmail, passengerPhone,
            trainId, journeyDate, selectedClass, passengers, quota
        } = req.body;

        // Validation - required fields
        if (!passengerName || !passengerCnic || !passengerEmail || !trainId || !journeyDate || !selectedClass || !passengers) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be filled',
                code: 'MISSING_FIELDS',
                requiredFields: ['passengerName', 'passengerCnic', 'passengerEmail', 'trainId', 'journeyDate', 'selectedClass', 'passengers']
            });
        }

        // Validate CNIC format
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
        if (!cnicRegex.test(passengerCnic.trim())) {
            return res.status(400).json({
                success: false,
                message: 'CNIC must be in format: 12345-1234567-1',
                code: 'INVALID_CNIC'
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(passengerEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address',
                code: 'INVALID_EMAIL'
            });
        }

        // Validate passengers count
        const passengerCount = parseInt(passengers);
        if (isNaN(passengerCount) || passengerCount < 1 || passengerCount > 10) {
            return res.status(400).json({
                success: false,
                message: 'Number of passengers must be between 1 and 10',
                code: 'INVALID_PASSENGERS'
            });
        }

        // Validate journey date
        const journeyDateObj = new Date(journeyDate);
        if (isNaN(journeyDateObj.getTime()) || journeyDateObj < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Journey date must be valid and in the future',
                code: 'INVALID_DATE'
            });
        }

        // Get train details
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ 
                success: false, 
                message: 'Train not found',
                code: 'TRAIN_NOT_FOUND'
            });
        }

        // Check if train is operational
        if (train.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'This train has been cancelled',
                code: 'TRAIN_CANCELLED'
            });
        }

        // Find the selected class and calculate fare
        const classInfo = train.classes.find(c => c.className === selectedClass);
        if (!classInfo) {
            return res.status(400).json({ 
                success: false, 
                message: 'Selected class not available on this train',
                code: 'CLASS_NOT_AVAILABLE',
                availableClasses: train.classes.map(c => c.className)
            });
        }

        if (classInfo.availableSeats < passengerCount) {
            return res.status(400).json({ 
                success: false, 
                message: `Only ${classInfo.availableSeats} seats available in ${selectedClass}`,
                code: 'INSUFFICIENT_SEATS',
                availableSeats: classInfo.availableSeats
            });
        }

        const totalFare = classInfo.fare * passengerCount;

        // Create booking
        const booking = new Booking({
            passengerName,
            passengerCnic,
            passengerEmail,
            passengerPhone,
            trainId: train._id,
            trainName: train.trainName,
            fromStation: train.fromStation,
            toStation: train.toStation,
            journeyDate: journeyDateObj,
            selectedClass,
            passengers: passengerCount,
            quota: quota || 'General',
            totalFare
        });

        await booking.save();

        // Reduce available seats
        classInfo.availableSeats -= passengerCount;
        await train.save();

        res.status(201).json({
            success: true,
            message: 'Booking confirmed!',
            code: 'BOOKING_SUCCESS',
            booking: {
                pnr: booking.pnr,
                trainName: booking.trainName,
                from: booking.fromStation,
                to: booking.toStation,
                date: booking.journeyDate,
                class: booking.selectedClass,
                passengers: booking.passengers,
                totalFare: booking.totalFare,
                status: booking.bookingStatus,
                bookedAt: booking.bookedAt
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
            message: 'Failed to create booking. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get booking by PNR
 */
exports.getBookingByPNR = async (req, res) => {
    try {
        const pnr = req.params.pnr.toUpperCase().trim();

        if (!pnr) {
            return res.status(400).json({
                success: false,
                message: 'PNR number is required',
                code: 'MISSING_PNR'
            });
        }

        const booking = await Booking.findOne({ pnr });
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'No booking found with this PNR',
                code: 'BOOKING_NOT_FOUND',
                pnr
            });
        }

        res.status(200).json({ 
            success: true, 
            code: 'GET_BOOKING_SUCCESS',
            booking 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve booking. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get all bookings (admin only)
 */
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookedAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            code: 'GET_BOOKINGS_SUCCESS',
            count: bookings.length, 
            bookings 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve bookings. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};
