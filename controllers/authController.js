const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Constants
const CONSTANTS = {
  SALT_ROUNDS: 12,
  TOKEN_EXPIRY: "1h",
  MIN_PASSWORD_LENGTH: 6,
  MAX_USERNAME_LENGTH: 30,
};

const tokenBlacklist = new Set();

const validateInput = {
  username: (username) => {
    return (
      username &&
      typeof username === "string" &&
      username.length <= CONSTANTS.MAX_USERNAME_LENGTH &&
      /^[a-zA-Z0-9_]+$/.test(username)
    );
  },
  password: (password) => {
    return (
      password &&
      typeof password === "string" &&
      password.length >= CONSTANTS.MIN_PASSWORD_LENGTH
    );
  },
  name: (name) => {
    return name && typeof name === "string" && name.trim().length > 0;
  },
};

// Error handler
const handleError = (res, error, statusCode = 500) => {
  console.error(`Error: ${error.message}`);
  return res.status(statusCode).json({
    success: false,
    message: error.message,
    error: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

// verifyToken middleware
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "No token provided",
      });
    }

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        message: "Token has been invalidated",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// register
exports.register = async (req, res) => {
  try {
    const { account_user_username, account_user_password, account_user_name } =
      req.body;

    // Validate input
    if (!validateInput.username(account_user_username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username format",
      });
    }

    if (!validateInput.password(account_user_password)) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${CONSTANTS.MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    if (!validateInput.name(account_user_name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid name format",
      });
    }

    // Check if username already exists
    const [existingUser] = await pool.query(
      "SELECT account_user_id FROM account_user WHERE account_user_username = ?",
      [account_user_username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(
      account_user_password,
      CONSTANTS.SALT_ROUNDS
    );

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO account_user (account_user_username, account_user_password, account_user_name) VALUES (?, ?, ?)",
      [account_user_username, hashPassword, account_user_name]
    );

    res.status(201).json({
      success: true,
      message: "Account registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { account_user_username, account_user_password } = req.body;

    if (
      !validateInput.username(account_user_username) ||
      !validateInput.password(account_user_password)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input format",
      });
    }

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
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.account_user_id,
        username: user.account_user_username,
      },
      process.env.SECRET_KEY,
      { expiresIn: CONSTANTS.TOKEN_EXPIRY }
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
    return handleError(res, error);
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Add token to blacklist
    tokenBlacklist.add(token);

    // Optional: Clean up old tokens from blacklist
    setTimeout(() => {
      tokenBlacklist.delete(token);
    }, parseInt(CONSTANTS.TOKEN_EXPIRY) * 1000);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
