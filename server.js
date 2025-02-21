const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const server = express();
const router = express.Router(); // สร้าง router
// Swagger
const { setupSwagger } = require("./controllers/swaggerController");
setupSwagger(server);
const routesPath = path.join(__dirname, "routes");
const port = process.env.PORT;
// Authentication Controller
const authController = require("./controllers/authController");
const cookieParser = require("cookie-parser");
const middleware = require("./middleware/authMiddleware");
const loggingMiddleware = require("./middleware/loggingMiddleware");
// cookieParser
server.use(cookieParser());

server.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


server.use(express.json());
//ให้ Middleware ใช้กับทุก Request ที่เข้ามาใน Server
server.use(loggingMiddleware);
server.use(middleware);
// Swagger Documentation for Authentication Endpoints
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.get("/auth/get_session", authController.gettingSession);

server.requiresAuth = true; // config สำหรับ route authentication

// โหลด route files
fs.readdirSync(routesPath).forEach((file) => {
  try {
    if (file.endsWith(".js")) {
      const route = require(path.join(routesPath, file));
      console.log("Loaded Route:", file);

      // ใช้ router.use แทน server.use
      if (route.requiresAuth) {
        router.use("/", middleware, route);
      } else {
        router.use("/", route);
      }
    }
  } catch (error) {
    console.error(`Error loading route from file ${file}:`, error.message);
  }
});
server.options("*", cors());
// ใช้ router กับ /api path
server.use("/api", router);
// Centralized error handling middleware
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Start Server
server.listen(port, "0.0.0.0", () => {
  console.log(
    `App running on http://localhost: ..... - API for authentication and user account management`
  );
  console.log("CORS Origin:", process.env.CLIENT_ORIGIN);
});
