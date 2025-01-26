const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// verifyToken
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
  const { account_user_username, account_user_password, account_user_name } =
    req.body;

  // ตรวจสอบ input
  if (!account_user_username || !account_user_password || !account_user_name) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    // เข้ารหัส password ด้วย bcrypt
    const hashPassword = await bcrypt.hash(account_user_password, 12);

    // เพิ่มข้อมูลลง database
    const result = await pool.query(
      "INSERT INTO account_user (account_user_username, account_user_password,account_user_name) VALUES (?, ?, ?)",
      [account_user_username, hashPassword, account_user_name]
    );

    // ส่ง response
    res.status(201).json({
      message: "Account registered successfully",
      result,
    });
  } catch (err) {
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
  const { account_user_username, account_user_password } = req.body;
  if (!account_user_username || !account_user_password) {
    return res.status(400).json({ message: "Please provide all fields login" });
  }

  try {
    const [result] = await pool.query(
      "SELECT * FROM account_user WHERE account_user_username = ?",
      [account_user_username]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = result[0];
    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(
      account_user_password,
      user.account_user_password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // create JWT TOKEN
    const token = jwt.sign(
      {
        account_user_id: user.account_user_id,
        account_user_username: user.account_user_username,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
