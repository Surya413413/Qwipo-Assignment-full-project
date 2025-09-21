import React from 'react';
import './Compoenets.css';
function AddressList({ addresses, onEdit, onDelete }) {
  console.log("found found ",addresses)
const addressArray = Array.isArray(addresses) ? addresses : [addresses];

if (!addressArray || addressArray.length === 0) return <p>No addresses found.</p>;

return (
  <div className="address-list">
    {addressArray.map(address => (
      <div key={address.id} className="address-item">
        <p><strong>Address:</strong> {address.address_details}</p>
        <p><strong>City:</strong> {address.city}</p>
        <p><strong>State:</strong> {address.state}</p>
        <p><strong>Pin Code:</strong> {address.pin_code}</p>
        <button onClick={() => onEdit(address)}>Edit</button>
        <button onClick={() => onDelete(address.id)}>Delete</button>
      </div>
    ))}
  </div>
);
}

export default AddressList;