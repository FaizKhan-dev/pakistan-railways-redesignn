const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Class name is required'],
        enum: {
            values: ['Economy', 'Business', 'Premium', 'VIP'],
            message: 'Class must be Economy, Business, Premium, or VIP'
        }
    },
    fare: {
        type: Number,
        required: [true, 'Fare is required'],
        min: [0, 'Fare cannot be negative']
    },
    availableSeats: {
        type: Number,
        required: [true, 'Available seats is required'],
        min: [0, 'Seats cannot be negative'],
        max: [500, 'Invalid seat count']
    }
}, { _id: false });

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: [true, 'Train number is required'],
        unique: true,
        trim: true,
        match: [/^[A-Z0-9]{2,6}$/, 'Train number must be 2-6 alphanumeric characters'],
        index: true
    },
    trainName: {
        type: String,
        required: [true, 'Train name is required'],
        trim: true,
        minlength: [3, 'Train name must be at least 3 characters'],
        maxlength: [100, 'Train name cannot exceed 100 characters']
    },
    fromStation: {
        type: String,
        required: [true, 'From station is required'],
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{3}$/, 'Station code must be 3 uppercase letters'],
        index: true
    },
    toStation: {
        type: String,
        required: [true, 'To station is required'],
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{3}$/, 'Station code must be 3 uppercase letters'],
        validate: [{
            validator: function(v) { return v !== this.fromStation; },
            message: 'From and To stations must be different'
        }]
    },
    departureTime: {
        type: String,
        required: [true, 'Departure time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
    },
    arrivalTime: {
        type: String,
        required: [true, 'Arrival time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
    },
    status: {
        type: String,
        enum: {
            values: ['On Time', 'Delayed', 'Cancelled', 'Early'],
            message: 'Status must be On Time, Delayed, Cancelled, or Early'
        },
        default: 'On Time',
        index: true
    },
    delay: {
        type: Number,
        default: 0,
        min: [0, 'Delay cannot be negative']
    },
    classes: {
        type: [classSchema],
        required: [true, 'At least one class is required'],
        validate: [{
            validator: (v) => v.length > 0,
            message: 'Train must have at least one class'
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Create compound indexes for search optimization
trainSchema.index({ fromStation: 1, toStation: 1, status: 1 });
trainSchema.index({ trainNumber: 1, status: 1 });

module.exports = mongoose.model('Train', trainSchema);
