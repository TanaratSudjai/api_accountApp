const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOption = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Node.js Document",
      version: "1.0.0",
      description: "A System API Node.js server",
    },
    servers: [
      {
        url: process.env.PORTAPI_SWAGGER, // เปลี่ยน URL หากมีการ deploy จริง
      },
    ],
  },
  apis: ["routes/*.js"], // อ้างอิงไฟล์ route ที่มี comment swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOption);

module.exports = swaggerSpec;
