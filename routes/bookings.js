const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Train = require('../models/Train');

// POST /api/bookings — create a booking
router.post('/', async (req, res) => {
    try {
        const {
            passengerName, passengerCnic, passengerEmail, passengerPhone,
            trainId, journeyDate, selectedClass, passengers, quota
        } = req.body;

        if (!passengerName || !passengerCnic || !passengerEmail || !trainId || !journeyDate || !selectedClass || !passengers) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }

        // Get train details
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ success: false, message: 'Train not found' });
        }

        // Find the selected class and calculate fare
        const classInfo = train.classes.find(c => c.className === selectedClass);
        if (!classInfo) {
            return res.status(400).json({ success: false, message: 'Selected class not available on this train' });
        }

        if (classInfo.availableSeats < passengers) {
            return res.status(400).json({ success: false, message: `Only ${classInfo.availableSeats} seats available` });
        }

        const totalFare = classInfo.fare * passengers;

        const booking = new Booking({
            passengerName, passengerCnic, passengerEmail, passengerPhone,
            trainId: train._id,
            trainName: train.trainName,
            fromStation: train.fromStation,
            toStation: train.toStation,
            journeyDate: new Date(journeyDate),
            selectedClass,
            passengers: Number(passengers),
            quota: quota || 'General',
            totalFare
        });

        await booking.save();

        // Reduce available seats
        classInfo.availableSeats -= Number(passengers);
        await train.save();

        res.status(201).json({
            success: true,
            message: 'Booking confirmed!',
            booking: {
                pnr: booking.pnr,
                trainName: booking.trainName,
                from: booking.fromStation,
                to: booking.toStation,
                date: booking.journeyDate,
                class: booking.selectedClass,
                passengers: booking.passengers,
                totalFare: booking.totalFare,
                status: booking.bookingStatus
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// GET /api/bookings/:pnr — check booking by PNR
router.get('/:pnr', async (req, res) => {
    try {
        const booking = await Booking.findOne({ pnr: req.params.pnr.toUpperCase() });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'No booking found with this PNR' });
        }
        res.json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

module.exports = router;
