const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const getUserFromToken = (req) => {
  try {
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.token;
    console.log("getUserFromToken token : ", token);
    if (!token) {
      console.log("Token is missing");
      return null;
    }
    const user = jwt.verify(token, SECRET_KEY);
    // console.log("Decoded user from token:", user);

    return user;
  } catch (error) {
    console.error("Error in authUtils:", error.message);
    return null
  }
};

module.exports = { getUserFromToken };
