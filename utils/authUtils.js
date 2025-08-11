const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const getUserFromToken = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        massage: error.massage,
        text: "Error geted data group Transition Expense !",
      });
    }
    const user = jwt.verify(token, SECRET_KEY);

    return user;
  } catch (error) {
    console.error("Error in authUtils:", error.message);
    return null;
  }
};

module.exports = { getUserFromToken };
