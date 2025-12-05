const express = require('express');
const router = express.Router();
const { getProductImage } = require('../controllers/productController');

// Route to get product image by product ID
router.get('/:id/image', getProductImage);

module.exports = router;
