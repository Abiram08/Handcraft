// src/pages/ProductDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <h1>{product.name}</h1>
      <img src={`http://localhost:5000${product.image}`} alt={product.name} />
      <p>Price: ₹{product.price.toFixed(2)}</p>
      <p>{product.description || 'No description available.'}</p>
    </main>
  );
};

export default ProductDetailPage;