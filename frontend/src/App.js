import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🏢 Customer Management System</h1>
         <nav className="navbar">
  <Link to="/" className="nav-link">📋 Customer List</Link>
  <Link to="/customers/new" className="nav-link">➕ Add Customer</Link>

</nav>

        </header>
        <main>
          <Routes>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
