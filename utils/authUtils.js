const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const getUserFromToken = (req) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      console.log("Token is missing");
      return null;
    }
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.log("Token is missing in Authorization header");
      return null;
    }
    const authToken = authHeader.split(" ")[1];  // ดึง token ออกจาก header
    if (!authToken) {
      console.log("Token is missing in Authorization header");
      return null;  // หยุดการทำงานหากไม่มี token
    }
    const user = jwt.verify(authToken, SECRET_KEY);
    // console.log(user.account_user_id);

    return user;
  } catch (error) {
    console.error("Error in authUtils:", error.message);
  }
};

module.exports = { getUserFromToken };
