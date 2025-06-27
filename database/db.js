const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// เปลี่ยนจาก onnectTimeout เป็น connectTimeout
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0, // เพิ่มเข้าไป
  dateStrings: true,
});


module.exports = pool;