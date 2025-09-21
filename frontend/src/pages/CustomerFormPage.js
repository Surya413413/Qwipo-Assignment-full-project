import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CustomerForm from '../components/CustomerForm';
import './Pages.css';
const API_URL = 'http://localhost:5000';

function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchCustomer();
    }
  }, [id, isEditing]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/customers/${id}`);
      setCustomer(response.data.data);
    } catch (err) {
      setError('Failed to fetch customer details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      if (isEditing) {
        await axios.put(`${API_URL}/customers/${id}`, formData);
      } else {
        await axios.post(`${API_URL}/customers`, formData);
      }
      
      navigate('/');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save customer');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-page">
      <Link to="/">← Back to Customer Listttt</Link>
      
      <h1>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h1>
      
      {error && <div className="error">{error}</div>}
      
      <CustomerForm
        customer={customer}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default CustomerFormPage;