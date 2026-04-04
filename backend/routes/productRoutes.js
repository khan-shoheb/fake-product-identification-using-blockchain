const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Product add (manufacturer only)
router.post('/add', authMiddleware('manufacturer'), productController.addProduct);

// Product verify (consumer only)
router.get('/verify/:serial', authMiddleware('consumer'), productController.verifyProduct);

// Consumer purchase history (consumer only)
router.get('/history/:consumerId', authMiddleware('consumer'), productController.getPurchaseHistory);

module.exports = router;