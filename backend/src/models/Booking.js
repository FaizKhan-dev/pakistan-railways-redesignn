const mongoose = require('mongoose');

// Validation patterns
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;
const PHONE_REGEX = /^(\+92|0)?[1-9]\d{1,14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PNR_REGEX = /^PNR[A-Z0-9]{8}$/;

const bookingSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: [true, 'Passenger name is required'],
        trim: true,
        minlength: [3, 'Passenger name must be at least 3 characters'],
        maxlength: [100, 'Passenger name cannot exceed 100 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Passenger name can only contain letters']
    },
    passengerCnic: {
        type: String,
        required: [true, 'CNIC is required'],
        trim: true,
        match: [CNIC_REGEX, 'CNIC must be in format: 12345-1234567-1'],
        index: true
    },
    passengerEmail: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [EMAIL_REGEX, 'Please enter a valid email address'],
        index: true
    },
    passengerPhone: {
        type: String,
        trim: true,
        match: [PHONE_REGEX, 'Please enter a valid Pakistani phone number']
    },
    trainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: [true, 'Train ID is required'],
        index: true
    },
    trainName: { type: String, required: true },
    fromStation: { type: String, required: true, uppercase: true },
    toStation: { type: String, required: true, uppercase: true },
    journeyDate: {
        type: Date,
        required: [true, 'Journey date is required'],
        validate: [{
            validator: function(v) { return v > new Date(); },
            message: 'Journey date must be in the future'
        }],
        index: true
    },
    selectedClass: {
        type: String,
        required: [true, 'Class is required'],
        enum: ['Economy', 'Business', 'Premium', 'VIP']
    },
    passengers: {
        type: Number,
        required: [true, 'Number of passengers is required'],
        min: [1, 'At least 1 passenger is required'],
        max: [10, 'Maximum 10 passengers per booking']
    },
    quota: {
        type: String,
        enum: ['General', 'Student', 'Senior', 'Disabled'],
        default: 'General'
    },
    totalFare: {
        type: Number,
        required: [true, 'Total fare is required'],
        min: [0, 'Fare cannot be negative']
    },
    bookingStatus: {
        type: String,
        enum: {
            values: ['Confirmed', 'Pending', 'Cancelled'],
            message: 'Status must be Confirmed, Pending, or Cancelled'
        },
        default: 'Confirmed',
        index: true
    },
    pnr: {
        type: String,
        unique: true,
        sparse: true,
        match: [PNR_REGEX, 'Invalid PNR format'],
        index: true
    },
    bookedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Create compound indexes for query optimization
bookingSchema.index({ passengerEmail: 1, journeyDate: 1 });
bookingSchema.index({ trainId: 1, bookingStatus: 1 });

// Auto-generate PNR before saving
bookingSchema.pre('save', function (next) {
    if (!this.pnr) {
        this.pnr = 'PNR' + Date.now().toString().slice(-8).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
