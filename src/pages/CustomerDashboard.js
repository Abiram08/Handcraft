// src/pages/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <main className="container">
      <h1>Customer Dashboard</h1>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        orders
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => (
            <div key={order._id || order.id} className="order-card">
              <h3>Order #{order._id || order.id}</h3>
              <p><strong>Total:</strong> ₹{(order.totalAmount ?? 0).toFixed(2)}</p>
              <button onClick={() => openOrderDetails(order)} className="view-details-btn">
                View Details
              </button>
            </div>
          ))
      ) : (
        <p>No orders found.</p>
      )}

      {/* Order Details Popup */}
      {selectedOrder && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={closeOrderDetails}>
              ×
            </button>
            <h2>Order Details - #{selectedOrder._id || selectedOrder.id}</h2>
            <p><strong>Total:</strong> ₹{(selectedOrder.totalAmount ?? 0).toFixed(2)}</p>
            <p><strong>Products:</strong></p>
            <ul>
              {selectedOrder.products && selectedOrder.products.length > 0 ? (
                selectedOrder.products.map((product, index) => (
                  <li key={index} className="product-detail-item">
                    <img
                      src={product.productId?.image ? `http://localhost:5000${product.productId.image}` : 'https://via.placeholder.com/50'}
                      alt={product.productId?.name || 'Product Image'}
                      className="product-image"
                    />
                    <span>{product.productId?.name || `Product ID: ${product.productId}`}</span> - Quantity: {product.quantity} - Price: ₹{product.price.toFixed(2)}
                  </li>
                ))
              ) : (
                <li>No products found in this order.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default CustomerDashboard;
