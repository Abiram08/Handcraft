// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For showing product details
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      }
    };

    const fetchPendingProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products/pending', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPendingProducts(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching pending products:', err);
        setError('Failed to fetch pending products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchPendingProducts();
  }, []);

  const handleApprove = async (productId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${productId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPendingProducts((prev) => prev.filter((product) => product._id !== productId));
      setError('');
    } catch (err) {
      console.error('Error approving product:', err);
      setError(err.response?.data?.message || 'Error approving product.');
    }
  };

  const handleReject = async (productId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${productId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPendingProducts((prev) => prev.filter((product) => product._id !== productId));
      setError('');
    } catch (err) {
      console.error('Error rejecting product:', err);
      setError(err.response?.data?.message || 'Error rejecting product.');
    }
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>

      <h2>Manage Users</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              {user.firstName} {user.lastName} ({user.email}) - Role: {user.role}
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>

      <h2>Pending Products for Approval</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading pending products...</p>
      ) : (
        <div className="product-grid">
          {pendingProducts.length > 0 ? (
            pendingProducts.map((product) => (
              <div key={product._id} className="product-card-minimized">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
                  onClick={() => handleImageClick(product)}
                  style={{ cursor: 'pointer' }}
                />
                <h3>{product.name}</h3>
                <button className="btn btn-small" onClick={() => handleApprove(product._id)}>
                  Approve
                </button>
                <button className="btn btn-small btn-danger" onClick={() => handleReject(product._id)}>
                  Reject
                </button>
              </div>
            ))
          ) : (
            <p>No pending products.</p>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{selectedProduct.name}</h2>
            <img
              src={`http://localhost:5000${selectedProduct.image}`}
              alt={selectedProduct.name}
              className="popup-image"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
            />
            <p><strong>Price:</strong> ₹{selectedProduct.price.toFixed(2)}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Shop:</strong> {selectedProduct.shopName}</p>
            <p><strong>Location:</strong> {selectedProduct.location}</p>
            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <button className="btn btn-small btn-danger" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPage;