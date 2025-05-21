const { getUserFromToken } = require("../utils/authUtils");

const authMiddleware = (req, res, next) => {
  try {
    const user = getUserFromToken(req);
    req.user = user; // ใส่ข้อมูลผู้ใช้ลงใน `req.user`
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authMiddleware;
 