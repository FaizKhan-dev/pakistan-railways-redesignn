const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve HTML/CSS/JS files

// Routes
const authRoutes = require('./routes/auth');
const trainRoutes = require('./routes/trains');
const feedbackRoutes = require('./routes/feedback');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        // Seed initial train data if DB is empty
        const Train = require('./models/Train');
        const count = await Train.countDocuments();
        if (count === 0) {
            await seedTrains();
            console.log('✅ Sample train data inserted');
        }

        app.listen(PORT, () => {
            console.log(`🚂 Pakistan Railways server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// Seed sample train data
async function seedTrains() {
    const Train = require('./models/Train');

    const trains = [
        {
            trainNumber: '15-Up',
            trainName: 'Green Line Express',
            fromStation: 'KHI',
            toStation: 'ISB',
            departureTime: '08:00',
            arrivalTime: '28:00',
            status: 'On Time',
            delay: 0,
            classes: [
                { className: 'AC Parlor', fare: 5500, availableSeats: 20 },
                { className: 'AC Sleeper', fare: 3800, availableSeats: 35 },
                { className: 'Economy', fare: 1500, availableSeats: 80 }
            ]
        },
        {
            trainNumber: '37-Up',
            trainName: 'Karakoram Express',
            fromStation: 'KHI',
            toStation: 'LHE',
            departureTime: '13:00',
            arrivalTime: '35:00',
            status: 'Delayed',
            delay: 45,
            classes: [
                { className: 'AC Business', fare: 4200, availableSeats: 12 },
                { className: 'AC Sleeper', fare: 3200, availableSeats: 28 },
                { className: 'Economy', fare: 1200, availableSeats: 60 }
            ]
        },
        {
            trainNumber: '146-Up',
            trainName: 'Awam Express',
            fromStation: 'KHI',
            toStation: 'PWR',
            departureTime: '16:30',
            arrivalTime: '44:30',
            status: 'On Time',
            delay: 0,
            classes: [
                { className: 'AC Business', fare: 5000, availableSeats: 18 },
                { className: 'Economy', fare: 1800, availableSeats: 100 }
            ]
        },
        {
            trainNumber: '9-Up',
            trainName: 'Allama Iqbal Express',
            fromStation: 'KHI',
            toStation: 'LHE',
            departureTime: '17:15',
            arrivalTime: '38:00',
            status: 'On Time',
            delay: 0,
            classes: [
                { className: 'AC Parlor', fare: 6000, availableSeats: 10 },
                { className: 'AC Sleeper', fare: 4000, availableSeats: 30 },
                { className: 'Economy', fare: 1400, availableSeats: 75 }
            ]
        },
        {
            trainNumber: '1-Up',
            trainName: 'Lahore Express',
            fromStation: 'KHI',
            toStation: 'LHE',
            departureTime: '10:00',
            arrivalTime: '30:00',
            status: 'On Time',
            delay: 0,
            classes: [
                { className: 'AC Business', fare: 4800, availableSeats: 22 },
                { className: 'Economy', fare: 1300, availableSeats: 90 }
            ]
        },
        {
            trainNumber: '7-Up',
            trainName: 'Khyber Mail',
            fromStation: 'KHI',
            toStation: 'PWR',
            departureTime: '09:00',
            arrivalTime: '39:00',
            status: 'On Time',
            delay: 0,
            classes: [
                { className: 'AC Sleeper', fare: 4500, availableSeats: 16 },
                { className: 'Economy', fare: 1900, availableSeats: 95 }
            ]
        },
        {
            trainNumber: '11-Up',
            trainName: 'Quetta Express',
            fromStation: 'KHI',
            toStation: 'QTA',
            departureTime: '20:00',
            arrivalTime: '42:00',
            status: 'On Time',
            delay: 0,
            classes: [
                { className: 'AC Sleeper', fare: 3600, availableSeats: 24 },
                { className: 'Economy', fare: 1100, availableSeats: 70 }
            ]
        }
    ];

    await Train.insertMany(trains);
}
