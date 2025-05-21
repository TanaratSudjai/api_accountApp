const sql = require("../database/db");
const path = require("path");
const multer = require("multer");
const { getUserFromToken } = require("../utils/authUtils");

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
    const query = `
        INSERT INTO account_type 
        (account_type_name, account_type_value, account_type_description, account_type_from_id, account_type_icon, account_type_important ,account_type_sum ,account_group_id, account_category_id, account_type_total) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
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
  WHERE account_type_id = ?`;

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

exports.GetAccountType = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;
  try {
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

exports.GetAccountTypeId = async (req, res) => {
  const { account_type_id } = req.params;
  try {
    const query = `SELECT * FROM account_type JOIN account_icon 
    ON account_type.account_type_icon = account_icon.account_icon_id WHERE account_type.account_group_id = ?`;

    const [account_type] = await sql.query(query, [account_type_id]);

    res.status(201).json({
      message: "Account type getId successfully",
      account_type,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error geting account!",
      error: err.message,
    });
  }
};

exports.DeleteAccountTypeId = async (req, res) => {
  const { account_type_id } = req.params;
  try {
    const query = `DELETE FROM account_type WHERE account_type_id = ?`;

    const [account_type] = await sql.query(query, [account_type_id]);

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
