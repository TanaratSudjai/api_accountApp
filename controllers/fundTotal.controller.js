const sql = require("../database/db");
const jwt = require("jsonwebtoken");

exports.get_three_type = async (req, res) => {
  console.log(req.cookies.token);
  const account_user_id = jwt.decode(req.cookies.token).account_user_id;
  if (!account_user_id) {
    return res.status(401).json({ error: "Unauthorized or missing user ID" });
  }
  const connection = await sql.getConnection();
  try {
    // Owner sum (categories 1, 6, 7)
    const [get_sum_cat_one_six_seven] = await connection.query(
      `SELECT SUM(account_type_sum) as total_owner FROM account_type 
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id IN (1, 6, 7)
         AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    // Debt sum (category 2)
    const [get_sum_cat_two] = await connection.query(
      `SELECT SUM(account_type_sum) as total_debt FROM account_type 
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id = 2
         AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    // Fund sum (category 3)
    const [get_sum_cat_three] = await connection.query(
      `SELECT SUM(account_type_total) as total_fund FROM account_type 
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id = 3
         AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    res.status(200).json({
      message: "Getting successfully",
      total_owner: get_sum_cat_one_six_seven[0]?.total_owner || 0,
      total_debt: get_sum_cat_two[0]?.total_debt || 0,
      total_fund: get_sum_cat_three[0]?.total_fund || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, text: "Error getting fund summary!" });
  } finally {
    connection.release();
  }
};

exports.sumbitPerDay = async (req, res) => {
  console.log(req.cookies.token);
  const account_user_id = jwt.decode(req.cookies.token).account_user_id;
  const connection = await sql.getConnection();

  try {
    await connection.beginTransaction();

    // Submit all transitions
    await connection.query(
      `UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition_submit = 1 
      WHERE
          account_user.account_user_id = ? 
      `,[account_user_id]
    );

    // Get latest account_type_id used in transition
    const account_type_id_query = `
      SELECT at.account_type_id
      FROM account_transition AS at
      JOIN (
        SELECT MAX(account_transition_id) AS latest_id FROM account_transition
      ) AS latest ON at.account_transition_id = latest.latest_id
      LIMIT 1;
    `;
    const [results_type_id] = await connection.query(account_type_id_query);
    const account_type_cr_id = results_type_id[0]?.account_type_id;

    if (!account_type_cr_id) {
      await connection.rollback();
      connection.release();
      return res
        .status(400)
        .json({ error: "No latest account_type_id found." });
    }

    // Update sums for all types except category 3
    await connection.query(
      `UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = account_type.account_type_total 
      WHERE account_type.account_category_id != 3 AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: "Account transition submitted and sums updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  }
};

exports.getLastedFund = async (req, res) => {
  console.log(req.cookies.token);
  const account_user_id = jwt.decode(req.cookies.token).account_user_id;

  try {
    const [rows] = await sql.query(
      `SELECT account_type.* 
       FROM account_type
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id IN (1, 6, 7, 2)
       AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    res.status(200).json({ message: "Found Fund.", data: rows });
  } catch (error) {
    console.error("Error updating fund value:", error);
    res.status(500).json({ error: "Error updating fund value." });
  }
};

exports.updateLastedFund = async (req, res) => {
  console.log(req.cookies.token);
  const account_user_id = jwt.decode(req.cookies.token).account_user_id;

  const { account_type_id, new_value, account_category_id } = req.body;

  const connection = await sql.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT account_type_sum FROM account_type WHERE account_type_id = ?`,
      [account_type_id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: "Account type not found." });
    }

    const currentSum = parseFloat(rows[0].account_type_sum);
    const newSum = parseFloat(new_value);
    const difference = newSum - currentSum;

    if (difference === 0) {
      await connection.rollback();
      connection.release();
      return res.status(200).json({ message: "No change in value." });
    }

    let diffMain = 0;
    let diffOpposite = 0;

    if ([1, 6, 7].includes(account_category_id)) {
      // Increase in 1,6,7 => both +, decrease => both -
      diffMain = difference > 0 ? +Math.abs(difference) : -Math.abs(difference);
      diffOpposite = diffMain;
    } else if (account_category_id === 2) {
      // Increase in 2 => main +, opposite - ; decrease main -, opposite +
      if (difference > 0) {
        diffMain = +Math.abs(difference);
        diffOpposite = -Math.abs(difference);
      } else {
        diffMain = -Math.abs(difference);
        diffOpposite = +Math.abs(difference);
      }
    } else {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: "Unsupported account category." });
    }

    // Update main account
    await connection.query(
      `UPDATE account_type
       SET account_type_sum = account_type_sum + ?,
           account_type_total = account_type_total + ?
       WHERE account_type_id = ?`,
      [diffMain, diffMain, account_type_id]
    );

    // Update category 3 for the user
    await connection.query(
      `UPDATE account_type
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       SET account_type.account_type_sum = account_type.account_type_sum + ?,
           account_type.account_type_total = account_type.account_type_total + ?
       WHERE account_type.account_category_id = 3
         AND account_group.account_user_id = ?`,
      [diffOpposite, diffOpposite, account_user_id]
    );

    await connection.commit();
    connection.release();

    res.status(200).json({ message: "Fund updated successfully." });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Transaction failed:", error);
    res.status(500).json({ error: "Transaction failed." });
  }
};

