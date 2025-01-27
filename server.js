const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const server = express();
const router = express.Router(); // แก้ไขการสร้าง router
dotenv.config();
// Swagger
const { setupSwagger } = require("./controllers/swaggerController");
setupSwagger(server);
const routesPath = path.join(__dirname, "routes");
const port = process.env.PORT || 5000;
// Authentication Controller
const authController = require("./controllers/authController");

server.use(cors());
server.use(express.json());
//ให้ Middleware ใช้กับทุก Request ที่เข้ามาใน Server
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
server.requiresAuth = true; // config สำหรับ route authentication
// Swagger Documentation for Authentication Endpoints
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints related to user authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

// ฟังก์ชันตรวจสอบว่า user login หรือไม่
const checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("กรุณา login ก่อน");
  }
  next();
};

// โหลด route files จากโฟลเดอร์ routes
fs.readdirSync(routesPath).forEach((file) => {
  try {
    // ตรวจสอบว่าไฟล์เป็น .js เท่านั้น
    if (file.endsWith(".js")) {
      const route = require(path.join(routesPath, file));
      console.log("Loaded Route:", file);

      // ใช้งาน route โดยตรวจสอบ requiresAuth
      if (route.requiresAuth) {
        server.use("/api", checkLogin, route);
      } else {
        server.use("/api", route);
      }
    }
  } catch (error) {
    console.error(`Error loading route from file ${file}:`, error.message);
  }
});

// Start Server
server.listen(port, "0.0.0.0", () => {
  console.log(
    `App running on http://localhost:${port} - API for authentication and user account management`
  );
});
