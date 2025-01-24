// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const SECRET_KEY = process.env.SECRET_KEY;

// // Middleware เพื่อตรวจสอบ JWT
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(403).json({ message: "Token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded; // เพิ่มข้อมูลผู้ใช้ที่ได้จาก JWT ลงใน req
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = { verifyToken };
