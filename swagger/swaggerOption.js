const dotenv = require("dotenv");
dotenv.config();
const swaggerJsdoc = require("swagger-jsdoc");
const envprocessing = process.env.API_BASE_URL;
const swaggerOption = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API backend server APP ACCOUNTING",
      version: "1.0.0",
      description: "A System API Node.js server",
    },
    servers: [
      {
        url: envprocessing, // เปลี่ยน URL หากมีการ deploy จริง
      },
    ],
  },
  apis: ["routes/*.js"], // อ้างอิงไฟล์ route ที่มี comment swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOption);

module.exports = swaggerSpec;
