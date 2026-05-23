require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// DB FIRST (IMPORTANT)
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
// THEN CONNECTION TEST
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
// DEBUG ROUTE (IMPORTANT)
// =======================
app.all("*", (req, res, next) => {
  console.log("🔥 HIT:", req.method, req.url);
  next();
});

// =======================
// BOOK APPOINTMENT API
// =======================
app.post("/book-appointment", (req, res) => {
  console.log("📩 BODY RECEIVED:", req.body);

  const {
    customer_name,
    customer_phone,
    customer_email,
    service,
    appointment_date,
    appointment_time,
  } = req.body;

  const sql = `
    INSERT INTO booking 
    (customer_name, customer_phone, customer_email, service, appointment_date, appointment_time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    customer_name,
    customer_phone,
    customer_email,
    service,
    appointment_date,
    appointment_time,
  ], (err, result) => {

    if (err) {
      console.log("❌ SQL ERROR:", err.message);
      return res.status(500).json({
        success: false,
        message: "DB error"
      });
    }

    console.log("✅ BOOKING SAVED");

    return res.json({
      success: true,
      message: "Booking successful"
    });
  });
});

// =======================
// START SERVER (VERY IMPORTANT)
