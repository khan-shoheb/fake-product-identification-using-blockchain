const express = require('express');
const router = express.Router();
const manufacturerController = require('../controllers/manufacturerController');
const authMiddleware = require('../middleware/authMiddleware');

// Manufacturer register
router.post('/add', authMiddleware('manufacturer'), manufacturerController.registerManufacturer);

// Manufacturer to seller product transfer
router.post('/sell', authMiddleware('manufacturer'), manufacturerController.transferToSeller);

module.exports = router;
