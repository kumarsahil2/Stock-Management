import React, { useState, useEffect } from 'react';
import api from '../api';

const initialForm = {
  name: '',
  category: '',
  price: '',
  stockQuantity: '',
  description: '',
  itemsSold: '',
};

const ProductForm = ({ fetchProducts, editProduct, setEditProduct }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editProduct) setForm({ ...initialForm, ...editProduct });
  }, [editProduct]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editProduct) {
      await api.put(`/products/${editProduct._id}`, form);
      setEditProduct(null);
    } else {
      await api.post('/products', form);
    }
    setForm(initialForm);
    fetchProducts();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <h3
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center'
        }}
      >
        {editProduct ? 'Edit Product' : 'Add Product'}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px'
        }}
      >
        {['name', 'category', 'price', 'stockQuantity', 'itemsSold', 'description'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            type={
              ['price', 'stockQuantity', 'itemsSold'].includes(field)
                ? 'number'
                : 'text'
            }
            required={field !== 'description'}
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              fontSize: '15px',
              transition: 'border-color 0.3s ease',
              width: '100%'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4f46e5')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
        ))}
      </div>

      <button
        type="submit"
        style={{
          display: 'block',
          margin: '25px auto 0',
          padding: '12px 25px',
          backgroundColor: '#4f46e5',
          color: 'white',
          fontSize: '16px',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#3730a3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#4f46e5')}
      >
        {editProduct ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default ProductForm;
