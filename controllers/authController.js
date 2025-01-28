const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  });
};

// register
exports.register = async (req, res) => {
  try {
    const { account_user_username, account_user_password, account_user_name } =
      req.body;

    // Validate input
    if (!account_user_username || !account_user_password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // เข้ารหัส password ด้วย bcrypt
    const hashPassword = await bcrypt.hash(account_user_password, 12);

    // เพิ่มข้อมูลลง database
    const result = await pool.query(
      "INSERT INTO account_user (account_user_username, account_user_password, account_user_name) VALUES (?, ?, ?)",
      [account_user_username, hashPassword, account_user_name]
    );

    // ส่ง response
    res.status(201).json({
      message: "Account registered successfully",
      result,
    });
  } catch (error) {
    console.error("Error during registration:", err);
    // จัดการข้อผิดพลาด
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { account_user_username, account_user_password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM account_user WHERE account_user_username = ?",
      [account_user_username]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(
      account_user_password,
      user.account_user_password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    // เพิ่มการตั้งค่า cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ใช้ secure ใน production
      sameSite: "strict", // หรือ "lax" ขึ้นอยู่กับการใช้งาน
      maxAge: 7 * 24 * 60 * 60 * 1000, // อายุ 7 วัน
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.account_user_id,
        username: user.account_user_username,
        name: user.account_user_name,
      },
    });
  } catch (error) {
    res.json({ error });
  }
};
// logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
