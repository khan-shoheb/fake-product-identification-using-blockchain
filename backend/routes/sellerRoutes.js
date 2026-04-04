const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middleware/authMiddleware');


// Add seller
router.post('/add', sellerController.addSeller);

// Seller product sell
router.post('/sell', authMiddleware('seller'), sellerController.sellProduct);

// Seller products query
router.get('/products/:sellerId', authMiddleware('seller'), sellerController.querySellerProducts);



module.exports = router;
