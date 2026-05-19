const Train = require('../models/Train');

/**
 * Search trains by from and to stations
 */
exports.searchTrains = async (req, res) => {
    try {
        const { from, to, trainClass } = req.query;

        // Validation
        if (!from || !to) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide from and to station codes',
                code: 'MISSING_STATIONS'
            });
        }

        const fromCode = from.toUpperCase().trim();
        const toCode = to.toUpperCase().trim();

        // Validate station code format
        if (!/^[A-Z]{3}$/.test(fromCode) || !/^[A-Z]{3}$/.test(toCode)) {
            return res.status(400).json({
                success: false,
                message: 'Station codes must be 3 uppercase letters',
                code: 'INVALID_STATION_CODE'
            });
        }

        if (fromCode === toCode) {
            return res.status(400).json({ 
                success: false, 
                message: 'From and To stations cannot be the same',
                code: 'SAME_STATIONS'
            });
        }

        // Build query
        let query = {
            fromStation: fromCode,
            toStation: toCode,
            status: { $ne: 'Cancelled' }  // Exclude cancelled trains
        };

        let trains = await Train.find(query);

        // Filter by class if specified
        if (trainClass && trainClass !== 'ALL') {
            trains = trains.filter(t => 
                t.classes.some(c => c.className === trainClass)
            );
        }

        res.status(200).json({ 
            success: true, 
            code: 'SEARCH_SUCCESS',
            count: trains.length,
            from: fromCode,
            to: toCode,
            trains 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search trains. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get all trains with live status
 */
exports.getTrainStatus = async (req, res) => {
    try {
        const trains = await Train.find(
            {}, 
            'trainNumber trainName fromStation toStation departureTime arrivalTime status delay'
        );
        
        res.status(200).json({ 
            success: true, 
            code: 'GET_STATUS_SUCCESS',
            count: trains.length,
            trains 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve train status. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get single train by ID
 */
exports.getTrainById = async (req, res) => {
    try {
        const trainId = req.params.id.trim();

        // Validate MongoDB ObjectId format
        if (!trainId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid train ID format',
                code: 'INVALID_ID'
            });
        }

        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ 
                success: false, 
                message: 'Train not found',
                code: 'TRAIN_NOT_FOUND'
            });
        }

        res.status(200).json({ 
            success: true, 
            code: 'GET_TRAIN_SUCCESS',
            train 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve train. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};

/**
 * Get all trains
 */
exports.getAllTrains = async (req, res) => {
    try {
        const trains = await Train.find();
        
        res.status(200).json({ 
            success: true, 
            code: 'GET_ALL_TRAINS_SUCCESS',
            count: trains.length, 
            trains 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve trains. Please try again.',
            code: 'SERVER_ERROR'
        });
    }
};
