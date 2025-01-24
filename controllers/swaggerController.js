const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger/swaggerOption");
const auth = require("basic-auth");
const dotenv = require("dotenv");
dotenv.config();

// const usernameswagger = process.env.USER_SWAGGERUI;
// const passwordswagger = process.env.PASS_SWAGGERUI;
// const basicAuthMiddleware = (req, res, next) => {
//   const user = auth(req);
//   if (user && user.name === usernameswagger && user.pass === passwordswagger) {
//     return next();
//   }
//   res.set("WWW-Authenticate", 'Basic realm="Enter your credentials"');
//   return res.status(401).send("Authentication required.");
// };

const setupSwagger = (server) => {
  server.use(
    "/domain/api",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};

module.exports = { setupSwagger };
