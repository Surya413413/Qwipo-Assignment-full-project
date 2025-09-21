import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddressList from '../components/AddressList';
import AddressForm from '../components/AddressForm';
import './Pages.css';

const API_URL = 'http://localhost:5000';



function CustomerDetailPage() {

  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCustomerDetails();
    fetchAddresses();
    
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/${id}`);
     const customerData = Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data || response.data;
      setCustomer(customerData);
    } catch (err) {
      setError('Failed to fetch customer details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/${id}/addresses`);
        
       
    
    const customerData = Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data;
      setAddresses(customerData);
      // console.log(" Address Array:", customerData); 
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      setFormLoading(true);
      if (editingAddress) {
        await axios.put(`${API_URL}/addresses/${editingAddress.id}`, addressData);
        
        
      } else {
        await axios.post(`${API_URL}/customers/${id}/addresses`, addressData);
       
      }
      fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      setError('Failed to save address');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddressDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`${API_URL}/addresses/${addressId}`);
        fetchAddresses();
      } catch (err) {
        setError('Failed to delete address');
        console.error(err);
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="customer-detail-page">
      <Link to="/">← Back to Customer List</Link>
      
      <div className="customer-info">
        <h1>{customer.first_name} {customer.last_name}</h1>
        <p><strong>Phone:</strong> {customer.phone_number}</p>
        <Link to={`/customers/${id}/edit`}>Edit Customer</Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="addresses-section">
        <div className="addresses-header">
          <h2>Addresses</h2>
          {!showAddressForm && (
            <button onClick={() => setShowAddressForm(true)}>
              Add New Address
            </button>
          )}
        </div>

        {showAddressForm && (
          <AddressForm
            address={editingAddress}
            onSubmit={handleAddressSubmit}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        )}

        <AddressList
          addresses={addresses}
          onEdit={handleAddressEdit}
          onDelete={handleAddressDelete}
        />
      </div>
    </div>
  );
}

export default CustomerDetailPage;