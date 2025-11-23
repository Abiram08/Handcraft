import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Order data:', response.data); // Log order data for debugging
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <main className="container" style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <h2>Products</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {order.products.map((item) => (
          <li key={item.productId._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <img
              src={item.productId.image ? `http://localhost:5000${item.productId.image}` : 'https://via.placeholder.com/100?text=No+Image'}
              alt={item.productId.name}
              style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px', borderRadius: '8px' }}
              onError={(e) => {
                console.log('Image load error for:', e.target.src);
                e.target.src = 'https://via.placeholder.com/100?text=No+Image';
              }}
            />
            <div>
              <p><strong>{item.productId.name}</strong></p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.price.toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/customer-dashboard" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Back to Dashboard</Link>
    </main>
  );
};

export default OrderDetails;
