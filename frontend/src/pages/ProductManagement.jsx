import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import '../App.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleExport = async () => {
    const res = await api.get('/products/export/csv', { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleImport = async e => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/products/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    fetchProducts();
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px 20px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1f2937'
      }}>Product Management</h1>
    
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleExport}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => e.target.style.background = 'linear-gradient(to right, #2563eb, #3b82f6)'}
          onMouseOut={e => e.target.style.background = 'linear-gradient(to right, #3b82f6, #60a5fa)'}
        >
          Export CSV
        </button>
    
        <label style={{
          background: 'linear-gradient(to right, #10b981, #34d399)',
          color: 'white',
          borderRadius: '10px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(to right, #059669, #10b981)'}
        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(to right, #10b981, #34d399)'}
        >
          Import CSV
          <input
            type="file"
            onChange={handleImport}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
          />
        </label>
      </div>
    
      <ProductForm fetchProducts={fetchProducts} editProduct={editProduct} setEditProduct={setEditProduct} />
      <ProductTable products={products} fetchProducts={fetchProducts} setEditProduct={setEditProduct} />
    </div>
    
  );
};

export default ProductManagement;