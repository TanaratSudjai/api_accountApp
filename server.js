const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const server = express();
const cors = require("cors");

// Swagger

const { setupSwagger } = require("./controllers/swaggerController");
setupSwagger(server);

const routesPath = path.join(__dirname, "routes");
server.use(cors());
dotenv.config();
const port = process.env.PORT || 5000;
server.use(express.json());

// route
// ฟังก์ชันตรวจสอบว่า user login หรือไม่
const checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // ตรวจสอบ session หรือ token ของ user
    return res.status(401).send("กรุณา login ก่อน");
  }
  next(); // ถ้า login แล้วให้ดำเนินการต่อ
};
fs.readdirSync(routesPath).forEach((file) => {
  try {
    const route = require(path.join(routesPath, file));

    // ตรวจสอบว่ามีการตั้งค่า middleware checkLogin ในแต่ละ route หรือไม่
    if (route.requiresAuth) {
      // ถ้า route นี้ต้องการการ login
      server.use("/api", checkLogin, route);
    }
  } catch (error) {
    console.error(`Error loading route from file ${file}:`, error.message);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(
    `App running on http://localhost:[112:542.651.234] This API provides authentication and user account management features, built using JWT for secure access.`
  );
});
