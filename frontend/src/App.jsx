import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductManagement from './pages/ProductManagement';
import StockOverview from './pages/StockOverview';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState('login');

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Stock Management System
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#4b5563',
          marginBottom: '1.5rem'
        }}>
          Welcome! Please {page === 'login' ? 'login to continue' : 'register to get started'}.
        </p>

        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          {page === 'login' ? <Login setToken={setToken} /> : <Register setToken={setToken} />}
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          {page === 'login' ? (
            <p style={{ fontSize: '0.9rem', color: '#374151' }}>
              New user?{' '}
              <button
                onClick={() => setPage('register')}
                style={{ color: '#3b82f6', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '0.9rem', color: '#374151' }}>
              Existing user?{' '}
              <button
                onClick={() => setPage('login')}
                style={{ color: '#3b82f6', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '1rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setPage('products')}
          style={buttonStyle('#3b82f6', '#60a5fa', '#2563eb', '#3b82f6')}
        >
          Product Page
        </button>

        <button
          onClick={() => setPage('stock')}
          style={buttonStyle('#10b981', '#34d399', '#059669', '#10b981')}
        >
          Stock Overview
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }}
          style={buttonStyle('#ef4444', '#f87171', '#dc2626', '#ef4444')}
        >
          Logout
        </button>
      </div>

      {page === 'products' ? <ProductManagement /> : <StockOverview />}
    </div>
  );
}

function buttonStyle(from, to, hoverFrom, hoverTo) {
  return {
    padding: '12px 24px',
    background: `linear-gradient(to right, ${from}, ${to})`,
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    onMouseOver: e => (e.target.style.background = `linear-gradient(to right, ${hoverFrom}, ${hoverTo})`),
    onMouseOut: e => (e.target.style.background = `linear-gradient(to right, ${from}, ${to})`)
  };
}

export default App;
