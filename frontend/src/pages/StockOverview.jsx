import React, { useEffect, useState } from 'react';
import api from '../api';
import StockChart from '../components/StockChart';
import '../App.css';

const StockOverview = () => {
  const [data, setData] = useState([]);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStock = async () => {
    const res = await api.get('/stock');
    setData(res.data.products);
    setTotalItemsSold(res.data.totalItemsSold);
    setTotalRevenue(res.data.totalRevenue);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const filteredProducts = data
    .filter((p) => {
      return (
        (!categoryFilter || p.category.toLowerCase().includes(categoryFilter.toLowerCase())) &&
        (!minPrice || p.price >= parseFloat(minPrice)) &&
        (!maxPrice || p.price <= parseFloat(maxPrice))
      );
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valA = sortKey === 'revenue' ? a.price * a.itemsSold : a[sortKey];
      const valB = sortKey === 'revenue' ? b.price * b.itemsSold : b[sortKey];
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

  return (
    <div className="stock-container">
      <h1 className="stock-title">📦 Stock Overview</h1>
      <div className="filter-section">
        <div className="filter-group">
          <label>Filter by Category</label>
          <input type="text" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} placeholder="e.g. Electronics" />
        </div>
        <div className="filter-group">
          <label>Min Price</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Max Price</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="itemsSold">Items Sold</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Order</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="summary-section">
        <div className="summary-card">
          <h2>Total Items Sold</h2>
          <p>{totalItemsSold}</p>
        </div>
        <div className="summary-card">
          <h2>Total Revenue</h2>
          <p>₹{totalRevenue}</p>
        </div>
      </div>
      <div className="chart-section">
        <h3>📊 Stock & Sales Chart</h3>
        <StockChart data={filteredProducts} />
      </div>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.stockQuantity}</td>
                <td>{p.itemsSold}</td>
                <td>₹{p.itemsSold * p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOverview;
