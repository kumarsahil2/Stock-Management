import React, { useEffect, useState } from 'react';
import api from '../api';
import '../App.css';

const ProductTable = ({ setEditProduct }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNumber) => {
    try {
      const res = await api.get(`/products?page=${pageNumber}`);
      const { products, totalPages } = res.data;
      setProducts(products || []);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(page); // refetch current page
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sold</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((prod, index) => (
              <tr key={prod._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{prod.name}</td>
                <td>{prod.category}</td>
                <td>₹{prod.price}</td>
                <td>{prod.quantity}</td>
                <td>{prod.itemsSold}</td>
                <td>{prod.description}</td>
                <td>
                  <button onClick={() => setEditProduct(prod)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(prod._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No products available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: '0 15px' }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductTable;
