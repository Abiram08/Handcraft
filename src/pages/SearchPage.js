import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { search: query, status: 'approved' },
        });
        setProducts(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart.`);
  };

  return (
    <main className="container">
      <h1>Search Results for "{query}"</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
                />
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price.toFixed(2)}</p>
                <p>Category: {product.category}</p>
                <p>Shop: {product.shopName}</p>
                <p>Location: {product.location}</p>
                <p>Quantity: {product.quantity}</p>
                <p>{product.description}</p>
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            ))
          ) : (
            <p>No products found for "{query}".</p>
          )}
        </div>
      )}
    </main>
  );
};

export default SearchPage;
