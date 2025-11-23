// src/pages/CheckoutPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const CheckoutPage = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // Basic validation
    if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.phone) {
      setError('Please fill in all shipping details.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    // Assuming all products in cart are from the same seller for simplicity
    const seller = cart[0].sellerId || cart[0].seller?._id;
    if (!seller) {
      setError('Seller information missing for the products.');
      return;
    }

    const products = cart.map(item => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Navigate to payment page with order details
    navigate('/payment', {
      state: {
        products,
        total,
        seller,
        shippingDetails,
      },
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <main className="container">
      <h1>Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add items to proceed.</p>
      ) : (
        <div className="checkout-page">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <h3>Total: ₹{total}</h3>
            </div>
          </div>

          <div className="shipping-details">
            <h2>Shipping Details</h2>
            {error && <p className="error">{error}</p>}
            <form className="shipping-form">
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={shippingDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
            <button onClick={handlePlaceOrder} className="place-order-btn">
              Place Order
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;