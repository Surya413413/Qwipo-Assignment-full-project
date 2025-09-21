Qwipo Customer Management Application
Table of Contents

Introduction

Tech Stack

Project Setup

Database Design

Backend (Node.js + Express)

Frontend (React)

Key Features

Running the Application

Screenshots

Author

1. Introduction

This is a full-stack Customer Management Application that allows users to:

Add, edit, delete, and view customers.

Manage multiple addresses for each customer.

Search and filter customers by name or city.

Navigate between pages with smooth pagination.

The application consists of a backend API built with Node.js and Express.js, a frontend UI built with React.js, and uses SQLite as the database.

2. Tech Stack
Layer	Technology	Purpose
Backend	Node.js + Express.js	Server-side logic and API
Database	SQLite	Store customer and address data
Frontend	React.js + React Router DOM	User interface
HTTP Requests	Axios	Fetch data from backend
CORS	cors	Enable frontend-backend communication
3. Project Setup
Folder Structure
customer-management-app/
├── client/         # React frontend
└── server/         # Node.js backend

customer-management-app/
├── client/                     # React frontend
│   ├── public/                 # Public assets
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── CustomerList.js
│   │   │   ├── CustomerForm.js
│   │   │   ├── AddressList.js
│   │   │   └── AddressForm.js
│   │   ├── pages/              # React pages
│   │   │   ├── CustomerListPage.js
│   │   │   ├── CustomerDetailPage.js
│   │   │   └── CustomerFormPage.js
│   │   ├── App.js              # Main app with routes
│   │   ├── index.js            # React entry point
│   │   └── Pages.css           # Common page styles
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── database.db             # SQLite database file
│   ├── index.js                # Main server entry point
│   ├── package.json
│   └── routes/                 # Optional: separate folder for routes
│       ├── customers.js
│       └── addresses.js
│
├── .gitignore
└── README.md


Backend Setup

Navigate to server/ folder:

cd server
npm init -y


Install dependencies:

npm install express sqlite3 cors


Create index.js as the backend entry point.

Start the server:

node index.js

Frontend Setup

Navigate to project root and create React app:

npx create-react-app client
cd client


Install dependencies:

npm install axios react-router-dom react-icons


Start the React development server:

npm start

4. Database Design (SQLite)
customers Table
Column	Type	Constraints
id	INTEGER	PRIMARY KEY AUTOINCREMENT
first_name	TEXT	NOT NULL
last_name	TEXT	NOT NULL
phone_number	TEXT	NOT NULL UNIQUE
addresses Table
Column	Type	Constraints
id	INTEGER	PRIMARY KEY AUTOINCREMENT
customer_id	INTEGER	FOREIGN KEY (customers)
address_details	TEXT	NOT NULL
city	TEXT	NOT NULL
state	TEXT	NOT NULL
pin_code	TEXT	NOT NULL

One customer can have multiple addresses.

5. Backend (Node.js + Express)
API Endpoints

Customer Endpoints

POST /api/customers → Create a new customer

GET /api/customers → List all customers (supports search, filter, pagination)

GET /api/customers/:id → Get single customer

PUT /api/customers/:id → Update customer

DELETE /api/customers/:id → Delete customer

Address Endpoints

POST /api/customers/:id/addresses → Add address

GET /api/customers/:id/addresses → Get all addresses for a customer

PUT /api/addresses/:addressId → Update address

DELETE /api/addresses/:addressId → Delete address

Example: Fetch All Customers
app.get('/api/customers', (req, res) => {
    const { search, city, page = 1, limit = 10 } = req.query;
    let sql = "SELECT * FROM customers WHERE 1=1";
    const params = [];

    if (search) {
        sql += " AND (first_name LIKE ? OR last_name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }
    if (city) {
        sql += " AND id IN (SELECT customer_id FROM addresses WHERE city LIKE ?)";
        params.push(`%${city}%`);
    }

    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get("SELECT COUNT(*) AS total FROM customers", (err2, total) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ data: rows, total: total.total });
        });
    });
});

6. Frontend (React)
Pages

CustomerListPage.js → Lists customers, supports search, filter, and pagination

CustomerDetailPage.js → Displays customer details and addresses

CustomerFormPage.js → Add or edit customer

Components

CustomerList.js → Renders customer table

CustomerForm.js → Customer form

AddressList.js → Lists customer addresses

AddressForm.js → Add/edit address

Example: Search & Filter Input with Icons
import { FaCity } from 'react-icons/fa';

<div className="input-icon-wrapper">
  <FaCity className="input-icon" />
  <input
    type="text"
    className="filter-input"
    placeholder="Filter by city..."
    value={cityFilter}
    onChange={(e) => setCityFilter(e.target.value)}
  />
</div>

7. Key Features

CRUD Operations for customers and addresses

Search & Filter by name and city

Pagination for customer list

Client & Server Validation

Smooth Navigation using React Router

8. Running the Application
Backend
cd server
node index.js

Frontend
cd client
npm start


Backend runs at: http://localhost:5000

Frontend runs at: http://localhost:5000

9. Screenshots

<img width="931" height="409" alt="image" src="https://github.com/user-attachments/assets/04e361a3-6457-4cd3-a254-02ae667d0673" />


10. Author

Name: suresh

GitHub: github.com/Surya413413
