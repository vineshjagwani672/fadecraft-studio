const mysql = require('mysql2/promise');

// Reuse pool across invocations when possible
const getPool = () => {
  if (global.__MYSQL_POOL) return global.__MYSQL_POOL;
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });
  global.__MYSQL_POOL = pool;
  return pool;
};

const jsonBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        if (!data) return resolve({});
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });

module.exports = async function (req, res) {
  const origin = process.env.CORS_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: 'Method not allowed' }));
  }

  try {
    const body = await jsonBody(req);
    const { ref, date, time, name, phone, notes, lines, grandTotal } = body || {};

    if (!ref || !date || !time || !name || !phone) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ message: 'Missing required fields' }));
    }

    const pool = getPool();
    const linesJSON = JSON.stringify(lines || []);

    const query = `
      INSERT INTO bookings (ref, date, time, name, phone, notes, lines, grandTotal, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.query(query, [ref, date, time, name, phone, notes || '', linesJSON, grandTotal || 0]);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: 'Booking saved successfully', bookingId: result.insertId, ref }));
  } catch (err) {
    console.error('book-appointment error', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: 'Internal server error', error: String(err).slice(0, 400) }));
  }
};
