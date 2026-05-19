const express = require('express');
const router = express.Router();
const Train = require('../models/Train');

// GET /api/trains/search?from=KHI&to=LHE&class=ALL
router.get('/search', async (req, res) => {
    try {
        const { from, to, trainClass } = req.query;

        if (!from || !to) {
            return res.status(400).json({ success: false, message: 'Please provide from and to station codes' });
        }

        if (from.toUpperCase() === to.toUpperCase()) {
            return res.status(400).json({ success: false, message: 'From and To stations cannot be the same' });
        }

        let query = {
            fromStation: from.toUpperCase(),
            toStation: to.toUpperCase()
        };

        let trains = await Train.find(query);

        // Filter by class if specified
        if (trainClass && trainClass !== 'ALL') {
            const classMap = {
                'AC': 'AC Parlor',
                'AC_SLEEPER': 'AC Sleeper',
                'AC_BUSINESS': 'AC Business',
                'ECONOMY': 'Economy'
            };
            const desiredClass = classMap[trainClass] || trainClass;
            trains = trains.filter(t => t.classes.some(c => c.className === desiredClass));
        }

        res.json({ success: true, count: trains.length, trains });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// GET /api/trains/status — all live statuses
router.get('/status', async (req, res) => {
    try {
        const trains = await Train.find({}, 'trainNumber trainName fromStation toStation departureTime arrivalTime status delay');
        res.json({ success: true, trains });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// GET /api/trains/:id
router.get('/:id', async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) return res.status(404).json({ success: false, message: 'Train not found' });
        res.json({ success: true, train });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

// GET /api/trains — all trains
router.get('/', async (req, res) => {
    try {
        const trains = await Train.find();
        res.json({ success: true, count: trains.length, trains });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error: ' + err.message });
    }
});

module.exports = router;
