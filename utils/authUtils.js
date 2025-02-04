const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const getUserFromToken = (req) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const authToken = authHeader.split(" ")[1];
    if (!authToken) {
      // throw new Error("Token is missing in Authorization header");
      console.log("Token is missing in Authorization header");
    }
    const user = jwt.verify(authToken, SECRET_KEY);
    return user;
  } catch (error) {
    console.error("Error in authUtils:", error.message);
    // throw new Error("Invalid or expired token");
  }
};

module.exports = { getUserFromToken };
