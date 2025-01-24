const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger/swaggerOption");

const setupSwagger = (server) => {
  server.use("/domain/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = { setupSwagger };
