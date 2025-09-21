import React, { useState, useEffect } from 'react';
import './Compoenets.css';
function CustomerForm({ customer, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone_number: customer.phone_number || ''
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          placeholder='Enter First Name'
          value={formData.first_name}
          onChange={handleChange}
        />
        {errors.first_name && <span className="error">{errors.first_name}</span>}
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          placeholder='Enter Last Name'
          value={formData.last_name}
          onChange={handleChange}
        />
        {errors.last_name && <span className="error">{errors.last_name}</span>}
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          placeholder='+91 XXXXXXXXXXX'
          value={formData.phone_number}
          onChange={handleChange}
        />
        {errors.phone_number && <span className="error">{errors.phone_number}</span>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : (customer ? 'Update' : 'Create')} Customer
      </button>
    </form>
  );
}

export default CustomerForm;