import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'ceramics',
    price: '',
    description: '',
    quantity: '',
    location: '',
    shopName: '',
    status: 'pending',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    data.append('location', formData.location);
    data.append('shopName', formData.shopName);
    data.append('status', formData.status);
    data.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/seller/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || 'Failed to add product');
      }

      navigate('/seller-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-product-form">
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="ceramics">Ceramics</option>
            <option value="jewellery">Jewellery</option>
            <option value="textiles">Textiles</option>
            <option value="woodwork">Woodwork</option>
          </select>
        </label>
        <label>
          Price:
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <label>
          Shop Name:
          <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required />
        </label>
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
