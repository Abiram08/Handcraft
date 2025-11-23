// src/components/Navbar.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const token = localStorage.getItem('token');
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate total number of items in the cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Handcraft Market</Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/ceramics">Ceramics</Link>
        </li>
        <li>
          <Link to="/jewellery">Jewellery</Link>
        </li>
        <li>
          <Link to="/textile">Textiles</Link>
        </li>
        <li>
          <Link to="/woodwork">Woodwork</Link>
        </li>
        <li>
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
        </li>
        {userRole === 'admin' && (
          <li>
            <Link to="/admin">Admin Dashboard</Link>
          </li>
        )}
        {userRole === 'customer' && (
          <li>
            <Link to="/customer-dashboard">Customer Dashboard</Link>
          </li>
        )}
        {userRole === 'seller' && (
          <li>
            <Link to="/seller-dashboard">Seller Dashboard</Link>
          </li>
        )}
        {token ? (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;