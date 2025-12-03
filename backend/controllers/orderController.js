const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { products, total, seller } = req.body;
    
    console.log('Create Order Request by user:', req.user._id);
    console.log('Order products:', products);
    console.log('Order total:', total);
    console.log('Order seller:', seller);

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    const order = await Order.create({
      user: req.user._id,
      seller,
      products,
      totalAmount: total,
      status: 'pending'
    });
    
    if (order) {
      console.log('Order created:', order._id);
      res.status(201).json(order);
    } else {
      res.status(400).json({ message: 'Invalid order data' });
    }
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    console.log('Get Orders Request by user:', req.user._id, 'role:', req.user.role);
    // If user is a seller, get orders where they are the seller
    if (req.user.role === 'seller') {
      const orders = await Order.find({ seller: req.user._id })
        .populate('user', 'name')
        .populate('products.productId', 'name image price');
      console.log('Orders found for seller:', orders.length);
      console.log('Orders data for seller:', JSON.stringify(orders, null, 2));
      return res.json(orders);
    }
    
    // Otherwise, get orders where they are the buyer
    const orders = await Order.find({ user: req.user._id })
      .populate('products.productId', 'name image price');
    console.log('Orders found for buyer:', orders.length);
    console.log('Orders data for buyer:', JSON.stringify(orders, null, 2));
    res.json(orders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.productId', 'name image price');
    
    if (order) {
      // Check if the order belongs to the logged in user or if user is the seller
      if (order.user.toString() !== req.user._id.toString() && 
          order.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is the seller of this order
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this order' });
    }
    
    order.status = status;
    
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
