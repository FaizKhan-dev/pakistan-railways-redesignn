const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: [true, 'Passenger name is required'],
        trim: true
    },
    passengerCnic: {
        type: String,
        required: [true, 'CNIC is required'],
        trim: true
    },
    passengerEmail: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    passengerPhone: {
        type: String,
        trim: true,
        default: ''
    },
    trainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: true
    },
    trainName: { type: String },
    fromStation: { type: String },
    toStation: { type: String },
    journeyDate: {
        type: Date,
        required: true
    },
    selectedClass: {
        type: String,
        required: true
    },
    passengers: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    quota: {
        type: String,
        default: 'General'
    },
    totalFare: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
        default: 'Confirmed'
    },
    pnr: {
        type: String,
        unique: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate PNR before saving
bookingSchema.pre('save', function (next) {
    if (!this.pnr) {
        this.pnr = 'PNR' + Date.now().toString().slice(-8).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
