import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SellerDashboard.css';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, pendingOrders: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productResponse = await fetch('http://localhost:5000/api/seller/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!productResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const productData = await productResponse.json();
        console.log('Products:', productData); // Debug: Inspect API response
        setProducts(productData);
        
        // Fetch orders
        const orderResponse = await fetch('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const orderData = await orderResponse.json();
        setOrders(orderData);
        
        // Calculate stats
        const totalSales = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orderData.filter(order => order.status === 'pending').length;
        
        setStats({
          totalSales,
          totalOrders: orderData.length,
          pendingOrders,
        });
        
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSellerData();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/seller/products/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        setProducts(products.filter(product => product._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <Link to="/add-product" className="add-product-btn">
          Add New Product
        </Link>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon sales-icon">
            {/* Sales Icon */}
          </div>
          <div className="stat-details">
            <h3>Total Sales</h3>
            <p>₹{stats.totalSales.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            {/* Orders Icon */}
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending-icon">
            {/* Pending Icon */}
          </div>
          <div className="stat-details">
            <h3>Pending Orders</h3>
            <p>{stats.pendingOrders}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2>Recent Orders</h2>
            <div className="recent-orders">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <span className={`order-status status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Items: {order.products.length}</p>
                  <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
                </div>
              ))}
              {orders.length === 0 && <p>No orders yet.</p>}
            </div>
            
            <h2>Product Inventory</h2>
            <div className="product-inventory">
              {products.slice(0, 5).map(product => (
                <div key={product._id} className="product-card">
                  <img 
                    src={`http://localhost:5000${product.image}`} 
                    alt={product.name}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
                  />
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>Price: ₹{product.price.toFixed(2)}</p>
                    <p>Stock: {product.quantity ?? 'N/A'}</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p>No products yet.</p>}
            </div>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="products-tab">
            <h2>Your Products</h2>
            <div className="products-list">
              <div className="products-header">
                <span>Image</span>
                <span>Name</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Category</span>
                <span>Actions</span>
              </div>
              
              {products.map(product => (
                <div key={product._id} className="product-item">
                  <img 
                    src={`http://localhost:5000${product.image}`} 
                    alt={product.name}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
                  />
                  <span>{product.name}</span>
                  <span>₹{product.price.toFixed(2)}</span>
                  <span>{product.quantity ?? 'N/A'}</span>
                  <span>{product.category}</span>
                  <div className="product-actions">
                    <Link to={`/edit-product/${product._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {products.length === 0 && (
                <p className="no-items">No products yet. Add your first product!</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>Your Orders</h2>
            <div className="orders-list">
              <div className="orders-header">
                <span>Order ID</span>
                <span>Date</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              
              {orders.map(order => (
                <div key={order._id} className="order-item">
                  <span>#{order._id.substring(0, 8)}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>{order.user?.name || 'Customer'}</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                  <span className={`status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <div className="order-actions">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Link to={`/order-details/${order._id}`} className="view-btn">
                      View
                    </Link>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <p className="no-items">No orders yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;