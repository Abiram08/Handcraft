// src/pages/PaymentPage.js
import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCart } = useContext(CartContext);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Extract order details passed from CheckoutPage
  const { products, total, seller, shippingDetails } = location.state || {};

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!products || !total || !seller || !shippingDetails) {
    return <p>Missing order details. Please go back to checkout.</p>;
  }

  const handlePayment = () => {
    setError('');
    setPaymentProcessing(true);

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay test key
      amount: total * 100, // amount in the smallest currency unit
      currency: 'INR',
      name: 'Handcraft Store',
      description: 'Test Transaction',
      handler: async function (response) {
        // On successful payment, place the order
        try {
          const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              products,
              total,
              seller,
              shippingDetails,
              paymentId: response.razorpay_payment_id,
            }),
          });

          if (!res.ok) {
            throw new Error('Failed to place order');
          }

          setCart([]);
          localStorage.removeItem('cart');

          alert('Payment successful and order placed!');
          navigate('/');
        } catch (err) {
          console.error('Order placement failed:', err);
          setError('Order could not be placed. Please contact support.');
        } finally {
          setPaymentProcessing(false);
        }
      },
      prefill: {
        name: shippingDetails.name,
        email: '', // optionally add email if available
        contact: shippingDetails.phone,
      },
      notes: {
        address: shippingDetails.address,
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: function () {
          setPaymentProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <main className="container">
      <h1>Payment</h1>
      <div className="payment-summary">
        <h2>Order Summary</h2>
        <ul>
          {products.map((item) => (
            <li key={item.productId}>
              Product ID: {item.productId}, Quantity: {item.quantity}, Price: ₹{item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>
      <div className="payment-section">
        {error && <p className="error">{error}</p>}
        <button onClick={handlePayment} disabled={paymentProcessing} className="payment-btn">
          {paymentProcessing ? 'Processing Payment...' : 'Pay with Razorpay'}
        </button>
      </div>
    </main>
  );
};

export default PaymentPage;
