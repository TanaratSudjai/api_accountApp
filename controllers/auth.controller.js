const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const redisServer = require("../database/redis");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

exports.verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { account_user_username, account_user_password, account_user_name } =
      req.body;

    // Validate input
    if (
      !account_user_username ||
      !account_user_password ||
      !account_user_name
    ) {
      await connection.rollback();
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // เข้ารหัส password ด้วย bcrypt
    const hashPassword = await bcrypt.hash(account_user_password, 12);

    // เพิ่มข้อมูลลง database
    const [result] = await connection.query(
      "INSERT INTO account_user (account_user_username, account_user_password, account_user_name) VALUES (?, ?, ?)",
      [account_user_username, hashPassword, account_user_name]
    );

    // ดึง ID ที่เพิ่งถูกเพิ่ม
    const userId = result.insertId;
    console.log("New user ID:", userId);

    const [open_group_private] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["ส่วนของเจ้าของ", userId, 3]
    );

    // ดึง ID ที่เพิ่งถูกเพิ่ม
    const new_group_id = open_group_private.insertId;

    // open type group
    await connection.query(
      "INSERT INTO account_type (account_group_id,account_category_id,account_type_icon, account_type_name, account_type_important, account_type_sum,account_type_total) VALUES (?, ?,?,?,?, ?,?)",
      [new_group_id, 3, 1, `ทุน ${account_user_name}`, 0, 0, 0]
    );

    // <---- ค่าเริ่มต้นของสินทรัพย์ ---->
    const [default_group_cat_1] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["เงินคงมือ", userId, 1]
    );
    const group_id_cat_1 = default_group_cat_1.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_1, 1, 44, `เงินสด`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของสินทรัพย์ ---->

    // <---- ค่าเริ่มต้นของหนี้สิน ---->
    const [default_group_cat_2] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["หนี้รายเดือน", userId, 2]
    );
    const group_id_cat_2 = default_group_cat_2.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_2, 2, 8, `เจ้าหนี้สมศรี`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของหนี้สิน ---->

    // <---- ค่าเริ่มต้นของรายรับ ---->
    const [default_group_cat_4] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["รายได้รายเดือน", userId, 4]
    );
    const group_id_cat_4 = default_group_cat_4.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_4, 4, 17, `เงินเดือน`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายรับ ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 1 ---->
    const [default_group_cat_5] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["อาหาร & เครื่องดื่ม", userId, 5]
    );
    const group_id_cat_5 = default_group_cat_5.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5, 5, 92, `อาหาร`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5, 5, 85, `คาเฟ่ / ร้านกาแฟ`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5, 5, 87, `ขนมขบเคี้ยว`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5, 5, 88, `น้ำดื่ม`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 1 ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 2 ---->
    const [default_group_cat_5_2] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["การเดินทาง & ขนส่ง", userId, 5]
    );
    const group_id_cat_5_2 = default_group_cat_5_2.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_2, 5, 131, `รถไฟ`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_2, 5, 123, `รถบัส`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_2, 5, 130, `แท็กซี่`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_2, 5, 128, `ค่าน้ำมัน`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_2, 5, 125, `ค่าซ่อมบำรุงรถ`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_2, 5, 124, `ค่าประกันรถ`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 2 ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 3 ---->
    const [default_group_cat_5_3] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["ที่อยู่อาศัย & ค่าสาธารณูปโภค", userId, 5]
    );
    const group_id_cat_5_3 = default_group_cat_5_3.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_3, 5, 107, `ค่าเช่าบ้าน / คอนโด`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_3, 5, 110, `ค่าน้ำ`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_3, 5, 103, `ค่าไฟ`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_3, 5, 108, `ค่าอินเทอร์เน็ต`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_3, 5, 109, `ค่าโทรศัพท์`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_3, 5, 106, `ค่าซ่อมแซมบ้าน`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 3 ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 4 ---->
    const [default_group_cat_5_4] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["สุขภาพ & การดูแลตัวเอง", userId, 5]
    );
    const group_id_cat_5_4 = default_group_cat_5_4.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_4, 5, 100, `ค่ารักษาพยาบาล`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_4, 5, 98, `ค่าประกันสุขภาพ`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_4, 5, 93, `เครื่องสำอาง`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_4, 5, 95, `อาหารเสริม`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 4 ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 5 ---->
    const [default_group_cat_5_5] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["ความบันเทิง & งานอดิเรก", userId, 5]
    );
    const group_id_cat_5_5 = default_group_cat_5_5.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_5, 5, 61, `ดูหนัง / คอนเสิร์ต`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_5, 5, 59, `เกม / แอปพลิเคชัน`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        group_id_cat_5_5,
        5,
        64,
        `ค่าแพลตฟอร์มสตรีมมิ่ง (Netflix, Spotify)`,
        0,
        0,
        0,
        0,
      ]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 5 ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 6 ---->
    const [default_group_cat_5_6] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["การเงิน & ภาษี", userId, 5]
    );
    const group_id_cat_5_6 = default_group_cat_5_6.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_6, 5, 75, `ค่าธรรมเนียมธนาคาร`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_6, 5, 76, `ค่าบัตรเครดิต`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_6, 5, 83, `ค่าภาษี`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_6, 5, 81, `เบี้ยประกันชีวิต`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 6 ---->

    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 7 ---->
    const [default_group_cat_5_7] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["ท่องเที่ยว & ที่พัก", userId, 5]
    );
    const group_id_cat_5_7 = default_group_cat_5_7.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_7, 5, 136, `ค่าที่พักโรงแรม`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_5_7, 5, 133, `ค่าตั๋วเครื่องบิน`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของรายจ่ายกลุ่มที่ 7 ---->

    // <---- ค่าเริ่มต้นของลูกหนี้ ---->
    const [default_group_cat_6] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["ลูกหนี้ทั่วไป", userId, 6]
    );
    const group_id_cat_6 = default_group_cat_6.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_6, 6, 8, `ลูกหนี้สมชาย`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของลูกหนี้ ---->

    // <---- ค่าเริ่มต้นของธนาคาร ---->
    const [default_group_cat_7] = await connection.query(
      "INSERT INTO account_group (account_group_name, account_user_id, account_category_id) VALUES (?, ?, ?)",
      ["ธนาคารทั่วไป", userId, 7]
    );
    const group_id_cat_7 = default_group_cat_7.insertId;
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_7, 7, 31, `กรุงไทย`, 0, 0, 0, 0]
    );
    await connection.query(
      "INSERT INTO account_type (account_group_id, account_category_id, account_type_icon, account_type_name, account_type_important, account_type_sum, account_type_total, account_type_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [group_id_cat_7, 7, 41, `กรุงเทพ`, 0, 0, 0, 0]
    );
    // <---- ค่าเริ่มต้นของธนาคาร ---->

    await connection.commit();
    res.status(201).json({
      message: "Account registered successfully",
      result,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// gettingSession Controller
exports.gettingSession = async (req, res) => {
  try {
    const session_id = jwt.decode(req.cookies.token)?.account_user_id;
    if (!session_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }

    const cacheKey = `user:${session_id}`;

    // 1️⃣ ลองดึงจาก Redis ก่อน
    const cachedData = await redisServer.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data_user: JSON.parse(cachedData),
        source: "redis",
      });
    }

    // 2️⃣ Query MySQL
    const query = `SELECT account_user_id, account_user_name, account_user_username FROM account_user WHERE account_user_id = ?`;
    const [result] = await pool.query(query, [session_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { account_user_id, account_user_name, account_user_username } =
      result[0];
    const userData = {
      account_user_id,
      account_user_name,
      account_user_username,
    };

    // 3️⃣ เก็บลง Redis พร้อม TTL 300 วินาที (5 นาที)
    await redisServer.set(cacheKey, JSON.stringify(userData), "EX", 300);

    res.json({
      success: true,
      data_user: userData,
      source: "mysql",
    });
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
      "SELECT account_user_username, account_user_password ,account_user_id ,account_user_name FROM account_user WHERE account_user_username = ?",
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
        account_user_username: user.account_user_username,
        account_user_name: user.account_user_name,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // ✅ ป้องกันการเข้าถึงจาก JavaScript
      secure: true, // ✅ ใช้ Secure เมื่อเป็น HTTPS
      sameSite: "none", // ✅ ป้องกันการเข้าถึงจาก cross-site
      path: "/",
      domain: process.env.DOMAIN, // ✅ กำหนดโดเมนที่สามารถเข้าถึง cookie นี้ได้
      maxAge: 2 * 60 * 60 * 1000, // 2 ชั่วโมง
      signed: true, // ✅ ใช้ signed cookie เพื่อป้องกันการแก้ไข cookie
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
