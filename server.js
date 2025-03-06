const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = express.Router();
const server = express();

// Swagger
const { setupSwagger } = require("./controllers/swaggerController");
setupSwagger(server);

// Middleware & Controllers
const authController = require("./controllers/authController");
const middleware = require("./middleware/authMiddleware");
const loggingMiddleware = require("./middleware/loggingMiddleware");

// CORS ต้องมาก่อน middleware อื่นๆ
server.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

// cookieParser และ JSON middleware
server.use(cookieParser());
server.use(express.json());

// Logging Middleware
server.use(loggingMiddleware);

// Authentication Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.get("/auth/get_session", authController.gettingSession);

// โหลด route files
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  try {
    if (file.endsWith(".js")) {
      const route = require(path.join(routesPath, file));
      console.log("Loaded Route:", file);

      if (route.requiresAuth) {
        router.use("/",middleware, route);
      }
      router.use("/", route);
    }
  } catch (error) {
    console.error(`Error loading route from file ${file}:`, error.message);
  }
});

// ใช้ router กับ /api path
server.use("/api", router);

// Centralized error handling
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
const port = process.env.PORT || 5000;
server.listen(port, "0.0.0.0", () => {
  console.log(`App running on http://localhost:${port} - API is live`);
  console.log("CORS Origin:", process.env.CLIENT_ORIGIN);
});
