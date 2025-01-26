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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }
    // Clear authentication cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // เพิ่ม path เพื่อให้แน่ใจว่าลบ cookie ถูกต้อง
    });

    // Clear refresh token if exists
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // ปรับปรุงการจัดการ error
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
