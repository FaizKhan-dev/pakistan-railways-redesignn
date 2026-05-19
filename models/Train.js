const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: { type: String, required: true },
    fare: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
});

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: true,
        unique: true
    },
    trainName: {
        type: String,
        required: true
    },
    fromStation: {
        type: String,
        required: true,
        uppercase: true
    },
    toStation: {
        type: String,
        required: true,
        uppercase: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['On Time', 'Delayed', 'Cancelled', 'Early'],
        default: 'On Time'
    },
    delay: {
        type: Number,
        default: 0
    },
    classes: [classSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Train', trainSchema);
