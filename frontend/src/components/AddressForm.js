import React, { useState, useEffect } from 'react';
import './Compoenets.css';

function AddressForm({ address, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    address_details: '',
    city: '',
    state: '',
    pin_code: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setFormData({
        address_details: address.address_details || '',
        city: address.city || '',
        state: address.state || '',
        pin_code: address.pin_code || ''
      });
    }
  }, [address]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address_details.trim()) {
      newErrors.address_details = 'Address details are required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pin_code.trim()) {
      newErrors.pin_code = 'Pin code is required';
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
    <form onSubmit={handleSubmit} className="address-form">
      <h3>{address ? 'Edit Address' : 'Add New Address'}</h3>
      <div>
        <label>Address Details:</label>
        <textarea
          name="address_details"
          value={formData.address_details}
          onChange={handleChange}
        />
        {errors.address_details && <span className="error">{errors.address_details}</span>}
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
        {errors.city && <span className="error">{errors.city}</span>}
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />
        {errors.state && <span className="error">{errors.state}</span>}
      </div>
      <div>
        <label>Pin Code:</label>
        <input
          type="text"
          name="pin_code"
          value={formData.pin_code}
          onChange={handleChange}
        />
        {errors.pin_code && <span className="error">{errors.pin_code}</span>}
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (address ? 'Update' : 'Add')} Address
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default AddressForm;