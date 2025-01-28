const dotenv = require("dotenv");
dotenv.config();
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Account Management API",
      version: "1.0.0",
      description:
        "This API provides authentication and user account management features, built using JWT for secure access.",
      contact: {
        name: "Account App GITHUB",
        url: "https://github.com/TanaratSudjai",
        email: "tanarat.dev18@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }], // Global security requirement
    servers: [
      {
        url: "https://api-accountapp.onrender.com/api",
        description: "Development Server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(swaggerOptions);
