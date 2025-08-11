const sql = require("../database/db");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const redisServer = require("../database/redis")

var groupID;

exports.CreateAccountType = async (req, res) => {
  const {
    account_type_name,
    account_type_value,
    account_type_description,
    account_type_from_id,
    account_type_icon,
    account_group_id,
    account_category_id,
  } = req.body;

  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

  if (!account_type_name || !account_group_id || !account_category_id) {
    return res.status(400).json({
      message: "Input not found!",
    });
  }

  if (!account_type_icon) {
    return res.status(400).json({
      message: "กรุณาเลือกไอคอน!",
    });
  }

  try {
    // ✅ 1. Check if this group belongs to this user
    const [groupCheck] = await sql.query(
      `SELECT account_group_id 
       FROM account_group 
       WHERE account_group_id = ? AND account_user_id = ?`,
      [account_group_id, account_user_id]
    );

    if (groupCheck.length === 0) {
      return res.status(403).json({
        message: "You are not allowed to create an account type in this group",
      });
    }

    // ✅ 2. Insert if ownership check passes
    const query = `
      INSERT INTO account_type 
      (account_type_name, account_type_value, account_type_description, account_type_from_id, account_type_icon, account_type_important, account_type_sum, account_group_id, account_category_id, account_type_total) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [new_account_type] = await sql.query(query, [
      account_type_name,
      account_type_value,
      account_type_description,
      account_type_from_id,
      account_type_icon,
      0,
      0,
      account_group_id,
      account_category_id,
      0,
    ]);

    // ✅ 3. Clear cache for this group
    const cacheKey = `account_type_${account_group_id}`;
    await redisServer.del(cacheKey);

    res.status(201).json({
      message: "Account type created successfully",
      new_account_type,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating account!",
      error: err.message,
    });
  }
};


exports.UpdateAccountType = async (req, res) => {
  const { account_type_id } = req.params;
  const {
    account_type_name,
    account_type_value,
    account_type_from_id,
    account_type_description,
    account_type_icon
  } = req.body;

  if (
    !account_type_id ||
    !account_type_name ||
    !account_type_value
  ) {
    return res.status(400).json({
      message: "Required fields are missing!",
    });
  }

  try {
    const query = `
      UPDATE account_type 
      SET account_type_name = ?, account_type_value = ?, account_type_from_id = ?, account_type_description = ?, account_type_icon = ?
      WHERE account_type_id = ?
    `;

    const [result] = await sql.query(query, [
      account_type_name,
      account_type_value,
      account_type_from_id,
      account_type_description,
      account_type_icon,
      account_type_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Account type not found!",
      });
    }

    // ลบ cache ที่เกี่ยวข้อง เช่น cache ของ account_type นี้
    const cacheKey = `account_type_`+this.groupID;
    await redisServer.del(cacheKey);

    res.status(200).json({
      message: "Account type updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating account type!",
      error: err.message,
    });
  }
};

exports.GetAccountTypeId = async (req, res) => {
  const { account_type_id } = req.params;
  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

  try {
    const cacheKey = `account_type_${account_type_id}`;
    console.log("get key", cacheKey);

    // Check Redis cache first
    const cachedData = await redisServer.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Account type retrieved successfully (from cache)",
        account_type: JSON.parse(cachedData),
        source: "redis",
      });
    }

    // Main query to get all account_type rows
    const query = `
      SELECT * 
      FROM account_type 
      JOIN account_icon ON account_type.account_type_icon = account_icon.account_icon_id 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_type.account_group_id = ? 
      AND account_user.account_user_id = ?
    `;
    const [account_type] = await sql.query(query, [account_type_id, account_user_id]);

    // Loop and fetch account_type_from_id_name for each
    for (let row of account_type) {
      if (row.account_type_from_id) {
        const [fromRows] = await sql.query(
          `SELECT account_type_name 
           FROM account_type 
           WHERE account_type_id = ?`,
          [row.account_type_from_id]
        );
        row.account_type_from_id_name = fromRows[0]?.account_type_name || null;
      } else {
        row.account_type_from_id_name = null;
      }
    }

    // Cache in Redis
    await redisServer.set(cacheKey, JSON.stringify(account_type), "EX", 300);

    res.status(200).json({
      message: "Account type retrieved successfully (from DB)",
      account_type,
      source: "mysql",
    });

  } catch (err) {
    res.status(500).json({
      message: "Error getting account!",
      error: err.message,
    });
  }
};


exports.DeleteAccountTypeId = async (req, res) => {
  const { account_type_id } = req.params;
  try {
    const query = `DELETE FROM account_type WHERE account_type_id = ?`;

    const [account_type] = await sql.query(query, [account_type_id]);

    const cacheKey = `account_type_`+this.groupID;
    await redisServer.del(cacheKey);

    res.status(201).json({
      message: "Account type Delete successfully",
      account_type,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error Delete account!",
      error: err.message,
    });
  }
};
exports.GetAccountType = async (req, res) => {
  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    const query = `SELECT * FROM account_type at 
    JOIN account_group ag ON at.account_group_id = ag.account_group_id
    WHERE ag.account_category_id in (1,7) AND account_user_id = ?`;

    const [account_type] = await sql.query(query, account_user_id);

    res.status(201).json({
      message: "Account type updating successfully",
      account_type,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error geting account!",
      error: err.message,
    });
  }
};

// exports.insertSumtype = async (req, res) => {
//   try {
//     const { account_type_sum } = req.body;
//     const { account_type_id } = req.params;

//     const query =
//       "UPDATE account_type SET account_type_sum =  account_type_sum + ? WHERE account_type_id = ? ";

//     const [result] = await sql.query(query, [
//       account_type_sum,
//       account_type_id,
//     ]);

//     res
//       .json({ data: result, success: "Insert Sum type table Success! " })
//       .status(200);
//   } catch (error) {
//     res
//       .json({
//         error: error.massage,
//         error: "insert sum for type table error !",
//       })
//       .status(500);
//   }
// };
