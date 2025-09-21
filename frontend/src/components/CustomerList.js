import React from 'react';
import { Link } from 'react-router-dom';
import './Compoenets.css';
function CustomerList({ customers, onDelete }) {
  if (customers.length === 0) {
    return <p>No customers found.</p>;
  }


  return (
    <div className="customer-list">
      <table>
        <thead>
          <tr>
            <th>👤 Name</th>
            <th>📱 Phone</th>
            <th>🏠 Addresses</th>
            <th>⚡ Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>
                <Link to={`/customers/${customer.id}`}>
                  {customer.first_name} {customer.last_name}
                </Link>
              </td>
              <td>{customer.phone_number}</td>
           <td>
    <Link to={`/customers/${customer.id}`}>👤 View Details</Link>  
  </td>
              <td>
                <Link to={`/customers/${customer.id}/edit`}>Edit</Link>
                <button onClick={() => onDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;