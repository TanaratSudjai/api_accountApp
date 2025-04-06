const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getUserFromToken } = require("../utils/authUtils");

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  console.log("This is Token verifyToken ", token);
  console.log("Token received in verifyToken:", token);

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("Decoded token:", decoded);
    req.account_user_id = decoded.id;
    next();
  });
};

// register
exports.register = async (req, res) => {
  try {
    const { account_user_username, account_user_password, account_user_name } =
      req.body;

    // Validate input
    if (
      !account_user_username ||
      !account_user_password ||
      !account_user_name
    ) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // เข้ารหัส password ด้วย bcrypt
    const hashPassword = await bcrypt.hash(account_user_password, 12);

    // เพิ่มข้อมูลลง database
    const [result] = await pool.query(
      "INSERT INTO account_user (account_user_username, account_user_password, account_user_name) VALUES (?, ?, ?)",
      [account_user_username, hashPassword, account_user_name]
    );

    // ดึง ID ที่เพิ่งถูกเพิ่ม
    const userId = result.insertId;
    console.log("New user ID:", userId);

    const [open_group_private] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["ส่วนของเจ้าของ", userId, 3]
    );

    // ดึง ID ที่เพิ่งถูกเพิ่ม
    const new_group_id = open_group_private.insertId;

    // open type group
    const [type_private] = await pool.query(
      "INSERT INTO account_type (account_group_id,account_category_id,account_type_icon, account_type_name, account_type_important, account_type_sum,account_type_total) VALUES (?, ?,?,?,?, ?,?) ",
      [new_group_id, 3, 1, `ทุน ${account_user_name}`, 0, 0,0]
    );

    console.log(type_private);

    // <---- ค่าเริ่มต้นของสินทรัพย์ ---->
    const [default_group_cat_1] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["เงินคงมือ", userId, 1]
    )
    const group_id_cat_1 = default_group_cat_1.insertId;
    const [default_type_cat_1] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_1, 1, 44, `เงินสด`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของสินทรัพย์ ---->

    // <---- ค่าเริ่มต้นของหนี้สิน ---->
    const [default_group_cat_2] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["หนี้รายเดือน", userId, 2]
    )
    const group_id_cat_2 = default_group_cat_2.insertId;
    const [default_type_cat_2] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_2, 2, 8, `เจ้าหนี้สมศรี`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของหนี้สิน ---->

    // <---- ค่าเริ่มต้นของรายรับ ---->
    const [default_group_cat_4] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["รายได้รายเดือน", userId, 4]
    )
    const group_id_cat_4 = default_group_cat_4.insertId;
    const [default_type_cat_4] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_4, 4, 17, `เงินเดือน`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายรับ ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 1 ---->
    const [default_group_cat_5] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["ค่าใช้จ่ายรายเดือน", userId, 5]
    )
    const group_id_cat_5 = default_group_cat_5.insertId;
    const [default_type_cat_5] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_5, 5, 2, `ค่าน้ำ`, 0, 0, 0, 0]
    );
    const [default_type_cat_5_2] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_5, 5, 3, `ค่าไฟ`, 0, 0, 0, 0]
    );
    const [default_type_cat_5_3] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_5, 5, 4, `ค่าบ้าน`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 1 ---->


    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 2 ---->
    const [default_group_cat_5_2] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["ค่่าใช้จ่ายประจำวัน", userId, 5]
    )
    const group_id_cat_5_2 = default_group_cat_5_2.insertId;
    const [default_type_cat_5_2_1] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_5_2, 5, 21, `ค่าอาหารเช้า`, 0, 0, 0, 0]
    );
    const [default_type_cat_5_2_2] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_5_2, 5, 22, `อาหารกลางวัน`, 0, 0, 0, 0]
    );
    const [default_type_cat_5_2_3] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_5_2, 5, 20, `อาหารเย็น`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 2 ---->

    // <---- ค่าเริ่มต้นของลูกหนี้ ---->
    const [default_group_cat_6] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["ลูกหนี้ทั่วไป", userId, 6]
    )
    const group_id_cat_6 = default_group_cat_6.insertId;
    const [default_type_cat_6] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_6, 6, 8, `ลูกหนี้สมชาย`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของลูกหนี้ ---->

    // <---- ค่าเริ่มต้นของธนาคาร ---->
    const [default_group_cat_7] = await pool.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?) ",
      ["ธนาคารทั่วไป", userId, 7]
    )
    const group_id_cat_7 = default_group_cat_7.insertId;
    const [default_type_cat_7] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_7, 7, 31, `กรุงไทย`, 0, 0, 0, 0]
    );
    const [default_type_cat_7_2] = await pool.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
      [group_id_cat_7, 7, 41, `กรุงเทพ`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของธนาคาร ---->

    // ส่ง response
    res.status(201).json({
      message: "Account registered successfully",
      result,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    // จัดการข้อผิดพลาด
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

exports.gettingSession = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (!user || !user.account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }
    const account_user_id = user.account_user_id;
    console.log("Account User ID:", account_user_id);

    const query = `SELECT * FROM account_user WHERE account_user_id = ?`;
    const [result] = await pool.query(query, [account_user_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = result[0];
    console.log("User Name:", userData.account_user_name);
    console.log("User found:", user);

    res.json({ success: true, data_user: userData });
  } catch (error) {
    console.error("Error in gettingSession:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { account_user_username, account_user_password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM account_user WHERE account_user_username = ?",
      [account_user_username]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(
      account_user_password,
      user.account_user_password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      {
        account_user_id: user.account_user_id,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // ✅ ป้องกันการเข้าถึงจาก JavaScript
      secure: true, // ✅ ใช้ Secure เมื่อเป็น HTTPS
      sameSite: "None", // ✅ ให้ Cookie ทำงานข้าม Origin ได้
    });
    console.log("Token at storage : ", token);
    console.log("Token created:", token);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.account_user_id,
        username: user.account_user_username,
        name: user.account_user_name,
      },
      status: 200,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "strict",
      path: "/",
    });
    console.log("Token cleared on logout");
    res.json({
      success: true,
      message: "Logout successful, please remove token from client storage",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
