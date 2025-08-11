const sql = require("../database/db");

exports.createCategoryCr = async (req, res) => {
  const { account_category_name } = req.body;
  var cr = "CR";
  try {
    const accountGroupQuery = `
      INSERT INTO account_category (account_category_name,account_category_base )
      VALUES (?,?)
    `;

    const account_category = await sql.query(accountGroupQuery, [
      account_category_name,
      cr,
    ]);

    res.status(201).json({
      message: "Category created successfully",
      accountCategoryId: account_category[0].insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating category",
      error: err.message,
    });
  }
};

exports.createCategoryDr = async (req, res) => {
  const { account_category_name } = req.body;
  var dr = "DR";
  try {
    const accountGroupQuery = `
        INSERT INTO account_category (account_category_name,  account_category_base)
        VALUES (? , ?)
      `;

    const account_category = await sql.query(accountGroupQuery, [
      account_category_name,
      dr,
    ]);

    res.status(201).json({
      message: "Category created successfully",
      accountCategoryId: account_category[0].insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating category",
      error: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  const { account_category_id } = req.params;
  const { account_category_name, account_category_base } = req.body;

  if (
    !account_category_id ||
    !account_category_name ||
    !account_category_base
  ) {
    return res.status(400).json({
      message: "Account Category ID, name, and base are required",
    });
  }

  try {
    const query = `UPDATE account_category SET account_category_name = ?, account_category_base = ? WHERE account_category_id = ?`;
    const [account_group_update] = await sql.query(query, [
      account_category_name,
      account_category_base,
      account_category_id,
    ]);

    if (account_group_update.affectedRows === 0) {
      return res.status(404).json({
        message: "Account Category not found",
      });
    }
    res.status(200).json({
      message: "Category updated successfully",
      account_group_update,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: "Update error!",
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const [result] = await sql.query("SELECT * FROM account_category");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error getting category",
      error: err.message,
    });
  }
};

exports.getCategoryId = async (req, res) => {
  const { account_category_id } = req.params;
  try {
    const [result] = await sql.query(
      "SELECT * FROM account_category WHERE account_category_id = ?",
      [account_category_id]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error getting category",
      error: err.message,
    });
  }
};
