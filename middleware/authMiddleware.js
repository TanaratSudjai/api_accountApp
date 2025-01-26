const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; // Replace with your secret key

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    return res.redirect("/"); // Redirect to the root path if the token is invalid
  }
};

module.exports = authMiddleware;
