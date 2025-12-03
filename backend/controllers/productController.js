const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get product image by product ID
// @route   GET /api/products/:id/image
// @access  Public
const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (product.image.startsWith('data:image')) {
      const base64Data = product.image.split(',')[1];
      const imgBuffer = Buffer.from(base64Data, 'base64');
      const mimeType = product.image.match(/data:(image\/.+);base64,/)[1];
      res.set('Content-Type', mimeType);
      return res.send(imgBuffer);
    }

    const imgBuffer = Buffer.from(product.image, 'base64');
    res.set('Content-Type', 'image/png');
    return res.send(imgBuffer);
  } catch (error) {
    console.error('Error fetching product image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add Product (with image upload)
// @route   POST /api/seller/products
// @access  Private (seller)
const addProduct = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, category, price, description, quantity, location, shopName, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      category,
      price: parseFloat(price),
      description,
      image: imageUrl,
      sellerId: req.user.id,
      status: status || 'pending',
      quantity: parseInt(quantity),
      location,
      shopName,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get Seller's Products
// @route   GET /api/seller/products
// @access  Private (seller)
const getSellerProducts = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
  } catch (err) {
    console.error('Error fetching seller products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update Product (Seller)
// @route   PUT /api/seller/products/:id
// @access  Private (seller)
const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, category, price, description, quantity, location, shopName, status } = req.body;

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price ? parseFloat(price) : product.price;
    product.description = description || product.description;
    product.quantity = quantity ? parseInt(quantity) : product.quantity;
    product.location = location || product.location;
    product.shopName = shopName || product.shopName;
    product.status = status || product.status;
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete Product (Seller)
// @route   DELETE /api/seller/products/:id
// @access  Private (seller)
const deleteProductSeller = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get Products by Category (for Category Pages)
// @route   GET /api/products
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get All Products (for Admin)
// @route   GET /api/products/all
// @access  Private (admin)
const getAllProducts = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const products = await Product.find().populate('sellerId', 'email');
    res.json(products);
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get Pending Products (for Admin)
// @route   GET /api/products/pending
// @access  Private (admin)
const getPendingProducts = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pendingProducts = await Product.find({ status: 'pending' });
    res.json(pendingProducts);
  } catch (err) {
    console.error('Error fetching pending products:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Approve Product
// @route   PUT /api/products/:id/approve
// @access  Private (admin)
const approveProduct = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = 'approved';
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error approving product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Reject Product
// @route   PUT /api/products/:id/reject
// @access  Private (admin)
const rejectProduct = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = 'rejected';
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error rejecting product:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete Product (Admin)
// @route   DELETE /api/products/admin/:id
// @access  Private (admin)
const deleteProductAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product (admin):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getProductImage,
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProductSeller,
  getProductsByCategory,
  getAllProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  deleteProductAdmin,
};