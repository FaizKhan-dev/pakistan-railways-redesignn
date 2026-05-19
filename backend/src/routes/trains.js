const express = require('express');
const { 
    searchTrains, 
    getTrainStatus, 
    getTrainById, 
    getAllTrains 
} = require('../controllers/trainsController');

const router = express.Router();

/**
 * @route   GET /api/trains/search?from=KHI&to=LHE&class=ALL
 * @desc    Search trains by stations
 * @access  Public
 */
router.get('/search', searchTrains);

/**
 * @route   GET /api/trains/status
 * @desc    Get all trains with live running status
 * @access  Public
 */
router.get('/status', getTrainStatus);

/**
 * @route   GET /api/trains/:id
 * @desc    Get single train by ID
 * @access  Public
 */
router.get('/:id', getTrainById);

/**
 * @route   GET /api/trains
 * @desc    Get all trains
 * @access  Public
 */
router.get('/', getAllTrains);

module.exports = router;
