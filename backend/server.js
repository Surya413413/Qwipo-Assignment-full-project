// server/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});


// GET /customers → With pagination + search + city filter
app.get("/customers", (req, res) => {
  const { search = "", city = "", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (search) {
    whereClause += " AND (first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (city) {
    whereClause += " AND id IN (SELECT customer_id FROM addresses WHERE city LIKE ?)";
    params.push(`%${city}%`);
  }

  // 1. Count total matching customers
  const countQuery = `SELECT COUNT(*) as count FROM customers ${whereClause}`;
  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      console.error("Error counting customers:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const total = countResult.count;

    // 2. Fetch paginated data
    const dataQuery = `SELECT * FROM customers ${whereClause} LIMIT ? OFFSET ?`;
    db.all(dataQuery, [...params, limit, offset], (err, rows) => {
      if (err) {
        console.error("Error fetching customers:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        message: "success",
        data: rows,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      });
    });
  });
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// POST /customers → Create customer with optional addresses
app.post("/customers", (req, res) => {
  const { first_name, last_name, phone_number, addresses = [] } = req.body;

  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO customers (first_name, last_name, phone_number)
    VALUES (?, ?, ?)
  `;

  db.run(query, [first_name, last_name, phone_number], function (err) {
    if (err) {
      console.error("Error inserting customer:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const customerId = this.lastID;

    // Insert addresses if provided
    if (addresses.length > 0) {
      const addressQuery = `
        INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
        VALUES (?, ?, ?, ?, ?)
      `;

      addresses.forEach(addr => {
        db.run(addressQuery, [
          customerId,
          addr.address_details,
          addr.city,
          addr.state,
          addr.pin_code
        ]);
      });
    }

    res.status(201).json({
      id: customerId,
      first_name,
      last_name,
      phone_number,
      addresses
    });
  });
});


// GET /api/customers/:id → Fetch customer by ID
app.get("/customers/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM customers WHERE id = ?";
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error("Error fetching customer:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (!row) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(row);
  });
});

// PUT /api/customers/:id → Update a customer
app.put("/customers/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number } = req.body;

  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    UPDATE customers
    SET first_name = ?, last_name = ?, phone_number = ?
    WHERE id = ?
  `;

  db.run(query, [first_name, last_name, phone_number, id], function (err) {
    if (err) {
      console.error("Error updating customer:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({
      message: "Customer updated successfully",
      id,
      first_name,
      last_name,
      phone_number
    });
  });
});

// DELETE /api/customers/:id → Delete a customer
app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM customers WHERE id = ?";

  db.run(query, [id], function (err) {
    if (err) {
      console.error("Error deleting customer:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully", id });
  });
});

// DELETE /api/customers → Delete all customers
app.delete("/customers", (req, res) => {
  const query = "DELETE FROM customers";

  db.run(query, function (err) {
    if (err) {
      console.error("Error deleting all customers:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "All customers deleted successfully", deletedCount: this.changes });
  });
});

// POST /api/customers/:id/addresses → Add a new address for a customer
app.post("/customers/:id/addresses", (req, res) => {
  const customer_id = req.params.id;
  const { address_details, city, state, pin_code } = req.body;

  // Validate request body
  if (!address_details || !city || !state || !pin_code) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [customer_id, address_details, city, state, pin_code], function (err) {
    if (err) {
      console.error("Error adding address:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({
      id: this.lastID,        // Newly inserted address ID
      customer_id,
      address_details,
      city,
      state,
      pin_code
    });
  });
});

// GET /api/customers/:id/addresses → Fetch all addresses for a customer
app.get("/customers/:id/addresses", (req, res) => {
  const customer_id = req.params.id;

  const query = "SELECT * FROM addresses WHERE customer_id = ?";

  db.all(query, [customer_id], (err, rows) => {
    if (err) {
      console.error("Error fetching addresses:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No addresses found for this customer" });
    }

    // res.json(rows);
    res.json({ data: rows });
  });
});

// PUT /api/addresses/:addressId → Update a specific address
app.put("/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;
  const { address_details, city, state, pin_code } = req.body;

  // Validate request body
  if (!address_details || !city || !state || !pin_code) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    UPDATE addresses
    SET address_details = ?, city = ?, state = ?, pin_code = ?
    WHERE id = ?
  `;

  db.run(query, [address_details, city, state, pin_code, addressId], function (err) {
    if (err) {
      console.error("Error updating address:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({
      message: "Address updated successfully",
      id: addressId,
      address_details,
      city,
      state,
      pin_code
    });
  });
});

// DELETE /api/addresses/:addressId → Delete a specific address
app.delete("/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;

  const query = "DELETE FROM addresses WHERE id = ?";

  db.run(query, [addressId], function (err) {
    if (err) {
      console.error("Error deleting address:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ message: "Address deleted successfully", id: addressId });
  });
});




module.exports = app

