// backend/routes/seller.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to the uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1634567890123.jpg
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET /api/seller/products - Fetch all products for the logged-in seller
router.get('/products', auth(['seller']), async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/seller/products - Add a new product
router.post('/products', auth(['seller']), upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity, category, location, shopName, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      location,
      shopName,
      image: `/uploads/${req.file.filename}`, // Store the path to the image
      status: status || 'pending',
      sellerId: req.user.id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// backend/routes/seller.js (continued)
// GET /api/products/pending - Fetch all pending products (for admin)
router.get('/pending', auth(['admin']), async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: 'pending' });
    res.json(pendingProducts);
  } catch (err) {
    console.error('Error fetching pending products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id/approve - Approve a product (for admin)
router.put('/:id/approve', auth(['admin']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.status = 'approved';
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error approving product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id/reject - Reject a product (for admin)
router.put('/:id/reject', auth(['admin']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.status = 'rejected';
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error rejecting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products - Fetch approved products by category (for category pages)
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;