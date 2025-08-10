const sql = require("../database/db");
const jwt = require("jsonwebtoken");
const redisServer = require("../database/redis");

var catID;

exports.CreateAccountGroup = async (req, res) => {
  const { account_group_name, account_category_id } = req.body;
  
  if (!account_group_name || !account_category_id) {
    return res.status(401).json({
      message: "Account group name and account category ID are required",
    });
  }
  try {
    
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

    const query = `INSERT INTO account_group (account_group_name , account_category_id, account_user_id) 
    VALUES (? ,?, ?)`;

    const [new_account_group] = await sql.query(query, [
      account_group_name,
      account_category_id,
      account_user_id,
    ]);

    const cacheKey = `account_group_`+this.catID;
    await redisServer.del(cacheKey);
    res.status(201).json({
      message: "Group created successfully",
      new_account_group,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error for creating account!",
      error: err.message,
    });
  }
};

exports.GetAccountGroup = async (req, res) => {
  try {
    const cacheKey = `account_group_`+this.catID;
    console.log("get key", cacheKey);

    // ตรวจสอบ cache ก่อน
    const cachedData = await redisServer.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Account type retrieved successfully (from cache)",
        account_type: JSON.parse(cachedData),
        source: "redis",
      });
    }

    const query = `SELECT * FROM account_group`;

    const [account_group_all] = await sql.query(query);
    res.status(201).json({
      message: "Group geting successfully",
      account_group_all,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error for geting account!",
      error: err.message,
    });
  }
};

exports.GetAccountGroupById = async (req, res) => {
  const { account_group_id } = req.params;
  
  try {
    const cacheKey = `account_group_`+this.catID;
    console.log("get key", cacheKey);

    // ตรวจสอบ cache ก่อน
    const cachedData = await redisServer.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Account type retrieved successfully (from cache)",
        account_type: JSON.parse(cachedData),
        source: "redis",
      });
    }
    const query = `SELECT * FROM account_group WHERE account_group_id = ?`;

    const [account_group_by_id] = await sql.query(query, [account_group_id]);

    if (account_group_by_id.length === 0) {
      return res.status(404).json({
        message: "Account group not found",
      });
    }
    res.status(201).json({
      message: "Group geting successfully",
      account_group_by_id,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error for geting account!",
      error: err.message,
    });
  }
};

exports.DeleteAccountGroupById = async (req, res) => {
  const { account_group_id } = req.params;
  console.log("group id", this.catID);
  try {
    const query = `DELETE FROM account_group WHERE account_group_id = ?`;

    const [accounnt_group_delete] = await sql.query(query, [account_group_id]);

    if (accounnt_group_delete.length === 0) {
      return res.status(404).json({
        message: "Account group not found",
      });
    }

     const cacheKey = `account_group_`+this.catID;
    await redisServer.del(cacheKey);

    res.status(201).json({
      message: "Group deleting successfully",
      accounnt_group_delete,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error for deleting account!",
      error: err.message,
    });
  }
};

exports.UpdateAccountGroupById = async (req, res) => {
  const { account_group_id } = req.params;
  const { account_group_name } = req.body;
  try {
    const query = `UPDATE account_group SET   account_group_name = ? WHERE account_group_id = ?`;

    const [account_group_update] = await sql.query(query, [
      account_group_name,
      account_group_id,
    ]);

    if (account_group_update.length === 0) {
      return res.status(404).json({
        message: "Account group not found",
      });
    }

     const cacheKey = `account_group_`+this.catID;
     console.log("get key", cacheKey);
    await redisServer.del(cacheKey);
    res.status(201).json({
      message: "Group geting successfully",
      account_group_update,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error for geting account!",
      error: err.message,
    });
  }
};

exports.GetAccountTypeCount_groupID = async (req, res) => {
  const { account_category_id } = req.params;
  this.catID = account_category_id;

  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

    const cacheKey = `account_group_`+account_category_id;
    console.log("get key", cacheKey);

    // เช็ค cache ก่อน
    const cachedData = await redisServer.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Group retrieved successfully (from cache)",
        count_type_at_group: JSON.parse(cachedData),
        source: "redis",
      });
    }

    const query = `
      SELECT 
        ag.account_group_id, 
        ag.account_group_name, 
        at.account_type_important,
        COUNT(at.account_type_id) AS type_count
      FROM account_group ag
      LEFT JOIN account_type at ON ag.account_group_id = at.account_group_id
      WHERE ag.account_category_id = ? AND ag.account_user_id = ?
      GROUP BY ag.account_group_id, ag.account_group_name, at.account_type_important;
    `;

    const [count_type_at_group] = await sql.query(query, [
      account_category_id,
      account_user_id,
    ]);

    // เก็บ cache ใน Redis 5 นาที
    await redisServer.set(
      cacheKey,
      JSON.stringify(count_type_at_group),
      "EX",
      300
    );

    res.status(200).json({
      message: "Group retrieved successfully (from DB)",
      count_type_at_group,
      source: "mysql",
    });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({
      message: "Error fetching account data!",
      error: err.message,
    });
  }
};
