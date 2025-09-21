import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerList from '../components/CustomerList';
import { FaCity } from "react-icons/fa";
import './Pages.css';

const API_URL = 'http://localhost:5000';

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / 5);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
    fetchCustomers();
  }, 1000); // wait 400ms after typing stops

  return () => clearTimeout(delayDebounce);
  }, [search, cityFilter, page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (cityFilter) params.append('city', cityFilter);
      params.append('page', page);
      params.append('limit', 10);

      const response = await axios.get(`${API_URL}/customers?${params}`);
      setCustomers(response.data.data);
       setTotal(response.data.total); 
      setError('');

    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${API_URL}/customers/${customerId}`);
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer');
        console.error(err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="customer-page">
      <header className="customer-header">
        <h1 className="page-title">📋 Customer Management</h1>
      </header>
      
      <section className="filters-section">
        <form className="filter-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="filter-input"
            placeholder="🔍 Search customers..."
            value={search}
            onChange={(e) => {
    setPage(1);
    setSearch(e.target.value);
  }}
          />
          <input
            type="text"
            className="filter-input"
            placeholder="🏙️ Filter by city..."
            value={cityFilter}
            onChange={(e) => {
    setPage(1);
    setCityFilter(e.target.value);
  }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </section>

      {error && <div className="error-msg">{error}</div>}
      
      <section className="customer-table-section">
        <CustomerList customers={customers} onDelete={handleDelete} />
      </section>

      <footer className="pagination-section">
        <button 
          className="btn btn-secondary"
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
        >
          ◀ Previous
        </button>
        <span className="page-number">Page {page}</span>
        <button 
          className="btn btn-secondary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next ▶
        </button>
      </footer>
    </div>
  );
}

export default CustomerListPage;
