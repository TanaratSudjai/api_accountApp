const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swaggerOption");
const dotenv = require("dotenv");
dotenv.config();

const setupSwagger = (server) => {
  server.use("/domain/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = { setupSwagger };
