// src/pages/JewelleryPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const JewelleryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { category: 'jewellery', status: 'approved' },
        });
        setProducts(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching jewellery:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openDetailsPopup = (product) => {
    setSelectedProduct(product);
  };

  const closeDetailsPopup = () => {
    setSelectedProduct(null);
  };

  const openImagePreview = (imageSrc) => {
    setPreviewImage(imageSrc);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <main className="container">
      <h1>Jewellery</h1>
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
                  onClick={() => openDetailsPopup(product)}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price.toFixed(2)}</p>
                <button
                  onClick={() => openImagePreview(`http://localhost:5000${product.image}`)}
                  className="preview-btn"
                >
                  Preview Image
                </button>
                <button onClick={() => handleAddToCart(product)} className="add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No jewellery found.</p>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={closeDetailsPopup}>
              ×
            </button>
            <div className="popup-details">
              <img
                src={`http://localhost:5000${selectedProduct.image}`}
                alt={selectedProduct.name}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
                className="popup-image"
              />
              <div className="popup-text">
                <h2>{selectedProduct.name}</h2>
                <p><strong>Price:</strong> ₹{selectedProduct.price.toFixed(2)}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Shop:</strong> {selectedProduct.shopName}</p>
                <p><strong>Location:</strong> {selectedProduct.location}</p>
                <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="popup-overlay">
          <div className="image-preview-content">
            <button className="popup-close" onClick={closeImagePreview}>
              ×
            </button>
            <img
              src={previewImage}
              alt="Product Preview"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150/e9e5d8/8b5e34?text=Image+Not+Found')}
              className="preview-image"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default JewelleryPage;