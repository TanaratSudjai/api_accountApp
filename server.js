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
fs.readdirSync(routesPath).forEach((file) => {
  try {
    const route = require(path.join(routesPath, file));
    server.use("/api", route);
  } catch (error) {
    console.error(`Error loading route from file ${file}:`, error.message);
  }
});


server.listen(port, "0.0.0.0", () => {
  console.log(`App running on http://localhost:${port}`);
});
