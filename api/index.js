require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// DB SETUP
// =======================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// =======================
// DB CONNECTION TEST
// =======================
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// =======================
// DEBUG ROUTE
// =======================
app.all("*", (req, res, next) => {
  console.log("🔥 HIT:", req.method, req.url);
  next();
});

// =======================
// BOOKING ROUTE
// =======================
app.post("/book-appointment", (req, res) => {
  const { ref, date, time, name, phone, notes, lines, grandTotal } = req.body;

  if (!ref || !date || !time || !name || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const linesJSON = JSON.stringify(lines || []);

  const query = `
    INSERT INTO bookings (ref, date, time, name, phone, notes, lines, grandTotal, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [ref, date, time, name, phone, notes || "", linesJSON, grandTotal],
    (err, results) => {
      if (err) {
        console.error("❌ Insert Error:", err.message);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({
        message: "Booking saved successfully",
        bookingId: results.insertId,
        ref,
      });
    }
  );
});

// =======================
// EXPORT FOR VERCEL
// =======================
module.exports = app;
module.exports.handler = serverless(app);
