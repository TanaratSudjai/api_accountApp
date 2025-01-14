const sql = require("../database/db");

exports.CreateAccountGroup = async (req, res) => {
  const { account_group_name, account_category_id } = req.body;

  if (!account_group_name || !account_category_id) {
    return res.status(401).json({
      message: "Account group name and account category ID are required",
    });
  }

  try {
    const query = `INSERT INTO account_group (account_group_name , account_category_id) 
    VALUES (? ,?)`;

    const [new_account_group] = await sql.query(query, [
      account_group_name,
      account_category_id,
    ]);
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
  try {
    const query = `DELETE FROM account_group WHERE account_group_id = ?`;

    const [accounnt_group_delete] = await sql.query(query, [account_group_id]);

    if (accounnt_group_delete.length === 0) {
      return res.status(404).json({
        message: "Account group not found",
      });
    }
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

exports.GetAccountTypeCount_group = async (req, res) => {
  try {
    const query = `SELECT ag.account_group_id, ag.account_group_name, COUNT(at.account_type_id) AS type_count
                    FROM account_group ag
                    LEFT JOIN account_type at ON ag.account_group_id = at.account_group_id
                    GROUP BY ag.account_group_id;
                    `;

    const [count_type_at_group] = await sql.query(query);
    res.status(201).json({
      message: "Group geting successfully",
      count_type_at_group,
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
  try {
    const query = `
    SELECT ag.account_group_id ,ag.account_group_name, COUNT(at.account_type_id) AS type_count
    FROM account_group ag
    LEFT JOIN account_type at ON ag.account_group_id = at.account_group_id
    WHERE ag.account_category_id = ?
    GROUP BY ag.account_group_id;
  `;

    const [count_type_at_group] = await sql.query(query, [account_category_id]);
    res.status(201).json({
      message: "Group geting successfully",
      count_type_at_group,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error for geting account!",
      error: err.message,
    });
  }
};
