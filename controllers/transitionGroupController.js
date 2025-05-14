const sql = require("../database/db");
const { getUserFromToken } = require("../utils/authUtils");

exports.getMenuGroup_expense = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;

  const query = `
      SELECT
          account_type.account_type_id, 
          account_type.account_type_name, 
          account_type.account_type_value, 
          account_type.account_type_from_id, 
          account_group.account_category_id
      FROM
          account_type
      INNER JOIN
          account_group
          ON account_type.account_group_id = account_group.account_group_id
      WHERE 
          account_type.account_category_id IN (5) AND account_group.account_user_id = ?;
    `;
  try {
    const [result] = await sql.query(query, account_user_id);

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ error: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

exports.getMenuGroup_income = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;
  const query = `
      SELECT
          account_type.account_type_id, 
          account_type.account_type_name, 
          account_type.account_type_value, 
          account_type.account_type_from_id, 
          account_group.account_category_id
      FROM
          account_type
      INNER JOIN
          account_group
          ON account_type.account_group_id = account_group.account_group_id
      WHERE 
          account_type.account_category_id IN (4) AND account_group.account_user_id = ?;
    `;
  try {
    const [result] = await sql.query(query, account_user_id);

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ error: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};
exports.getCountSelectTransition = async (req, res) => {
  const query = `SELECT
                      COUNT(*) AS total_count
                  FROM
                      account_transition
                  WHERE
                      account_transition_start = 1
                      AND (account_transition_submit = 0 OR account_transition_submit IS NULL);
                  `;
  try {
    const [result] = await sql.query(query);

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ error: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};
exports.UpdateValue = async (req, res) => {
  const { account_type_id } = req.params;
  const { account_type_value } = req.body;

  const query = `UPDATE account_type SET account_type_value = ? WHERE account_type_id = ?`;

  try {
    await sql.query(query, [account_type_value, account_type_id]);
    res.json({ message: "Update successful" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.submit_transition_group_income_extend = async (req, res) => {
  try {
    const maxQuery = `
    SELECT COALESCE(MAX(account_transition_start), 0) +1 AS max_start
    FROM account_transition
    WHERE account_transition_submit = 1
  `;
    const [maxResult] = await sql.query(maxQuery);
    const newStartValue =
      (await maxResult[0].max_start) || account_transition_start;
    console.log(newStartValue);

    // Step 1:
    const id_last = `INSERT INTO account_transition (
                          account_type_id,
                          account_transition_value,
                          account_transition_datetime,
                          account_transition_start
                      )
                      SELECT 
                          account_type_from_id,
                          account_transition_value,
                          NOW(),
                          ?
                      FROM 
                          account_transition
                      WHERE 
                          account_transition_submit = 0 OR account_transition_submit IS NULL
                    `;

    const [result] = await sql.query(id_last, [newStartValue]);

    const query = `
      UPDATE account_transition
      SET account_transition_submit = 1;
    `;
    await sql.query(query);

    res.status(200).json({
      message: "Data inserted and updated successfully",
      result,
    });
  } catch (error) {
    console.error("Error inserting or updating account transition:", error);
    res.status(500).json({ error: "Error processing request." });
  }
};

// exports.getTypeFormId = async () => {
//   const [result] = sql.query('SELECT account_type_id, account_type_name, account_type_from_id FROM ');
// };

exports.getType_from_id = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;
  const [result] = await sql.query(`SELECT
                                account_type.account_type_id, 
                                account_category.account_category_name, 
                                account_type.account_type_icon, 
                                account_type.account_type_name, 
                                account_type.account_type_value, 
                                account_type.account_type_sum, 
                                account_type.account_type_total, 
                                account_type.account_type_from_id,
                                account_category.account_category_id,
                                account_icon.account_icon_name
                              FROM
                                account_group
                                INNER JOIN
                                account_category
                              ON 
                                  account_group.account_category_id = account_category.account_category_id
                              INNER JOIN
                                account_type
                              ON 
                                  account_type.account_group_id = account_group.account_group_id
                              JOIN 
                                account_icon
                              ON
                                  account_type.account_type_icon = account_icon.account_icon_id
                              WHERE 
                                  account_group.account_category_id in (1,7) AND account_group.account_user_id = ${account_user_id}
                                `);

  res.json({ result });
};

exports.getCreditor = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;

  const [result] = await sql.query(`SELECT
                                account_type.account_type_id, 
                                account_category.account_category_name, 
                                account_type.account_type_icon, 
                                account_type.account_type_name, 
                                account_type.account_type_value, 
                                account_type.account_type_sum, 
                                account_type.account_type_total, 
                                account_type.account_type_from_id,
                                account_category.account_category_id
                              FROM
                                account_group
                                INNER JOIN
                                account_category
                              ON 
                                  account_group.account_category_id = account_category.account_category_id
                              INNER JOIN
                                account_type
                              ON 
                                  account_type.account_group_id = account_group.account_group_id
                              WHERE 
                                  account_type.account_category_id = 2 
                                  AND 
                                  account_group.account_user_id = ${account_user_id}
                                `);

  res.json({ result });
};

exports.getDebtor = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;
  const [result] = await sql.query(`SELECT
                                account_type.account_type_id, 
                                account_category.account_category_name, 
                                account_type.account_type_icon, 
                                account_type.account_type_name, 
                                account_type.account_type_value, 
                                account_type.account_type_sum, 
                                account_type.account_type_total, 
                                account_type.account_type_from_id,
                                account_category.account_category_id
                              FROM
                                account_group
                                INNER JOIN
                                account_category
                              ON 
                                  account_group.account_category_id = account_category.account_category_id
                              INNER JOIN
                                account_type
                              ON 
                                  account_type.account_group_id = account_group.account_group_id
                              WHERE 
                                  account_type.account_category_id = 6 
                                  AND account_group.account_user_id = ${account_user_id}
                                `);

  res.json({ result });
};

exports.openAccountGroup_expense = async (req, res) => {
  try {
    const {
      account_type_id,
      account_transition_value,
      account_type_from_id,
      account_category_id,
      account_transition_start,
    } = req.body;

    const maxQuery = `
      SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
      FROM account_transition
      WHERE account_transition_submit = 1
    `;

    const [maxResult] = await sql.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    const query = `
      INSERT INTO account_transition 
      (account_type_id ,account_category_id, account_transition_value, account_transition_datetime ,account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id )
      VALUES (?, ?, ?, NOW(),?, ?, 1, ?, ?) 
      ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
    `;

    await sql.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_from_id,
      account_type_id,
      account_transition_value,
    ]);

    const update_type_total =
      "UPDATE account_type SET account_type_total = account_type_total - ? WHERE account_type_id  = ?";
    // loop id มา update

    await sql.query(update_type_total, [
      account_transition_value,
      account_type_from_id,
    ]);

    const history_sum = `UPDATE account_type SET account_type_total = account_type_total + ? WHERE account_type_id = ?`;
    await sql.query(history_sum, [account_transition_value, account_type_id]);
    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  }
};

exports.openAccountGroup_income = async (req, res) => {
  try {
    const {
      account_type_id,
      account_transition_value,
      account_type_from_id,
      account_category_id,
      account_transition_start,
    } = req.body;

    const maxQuery = `
      SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
      FROM account_transition
      WHERE account_transition_submit = 1
    `;

    const [maxResult] = await sql.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    const query = `
      INSERT INTO account_transition 
      (account_type_id ,account_category_id, account_transition_value, account_transition_datetime ,account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id )
      VALUES (?, ?, ?, NOW(),?, ?, 1, ?, ?) 
      ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
    `;

    await sql.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_id,
      account_type_from_id,
      account_transition_value,
    ]);

    const update_type_total =
      "UPDATE account_type SET account_type_total = account_type_total + ? WHERE account_type_id  = ?";
    // loop id มา update

    await sql.query(update_type_total, [
      account_transition_value,
      account_type_from_id,
    ]);
    const history_sum = `UPDATE account_type SET account_type_total = ? WHERE account_type_id = ?`;
    await sql.query(history_sum, [account_transition_value, account_type_id]);
    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  }
};

exports.get_expense_transition = async (req, res) => {
  try {
    const [res_transitiongroup] = await sql.query(`
      SELECT
        account_transition.account_transition_id, 
        account_transition.account_type_id, 
        account_transition.account_transition_value, 
        account_transition.account_transition_start, 
        account_transition.account_transition_datetime, 
        account_group.account_category_id, 
        account_group.account_group_name, 
        account_type.account_type_name
      FROM
        account_transition
        INNER JOIN
        account_type
        ON 
          account_transition.account_type_id = account_type.account_type_id
        INNER JOIN
        account_group
        ON 
          account_type.account_group_id = account_group.account_group_id
      WHERE
        account_group.account_category_id = 5
        AND (account_transition.account_transition_submit = 0 OR
             account_transition.account_transition_submit IS NULL)
    `);
    res.json(res_transitiongroup);
  } catch (error) {
    res.json({
      massage: error.massage,
      text: "Error geted data group Transition Expense !",
    });
  }
};

exports.get_income_transition = async (req, res) => {
  try {
    const [res_transitiongroup] = await sql.query(`
      SELECT
        account_transition.account_transition_id, 
        account_transition.account_type_id, 
        account_transition.account_transition_value, 
        account_transition.account_transition_start, 
        account_transition.account_transition_datetime, 
        account_group.account_category_id, 
        account_group.account_group_name, 
        account_type.account_type_name
      FROM
        account_transition
        INNER JOIN
        account_type
        ON 
          account_transition.account_type_id = account_type.account_type_id
        INNER JOIN
        account_group
        ON 
          account_type.account_group_id = account_group.account_group_id
      WHERE
        account_group.account_category_id = 4
        AND (account_transition.account_transition_submit = 0 OR
             account_transition.account_transition_submit IS NULL)
    `);
    res.json(res_transitiongroup);
  } catch (error) {
    res.json({
      massage: error.massage,
      text: "Error geted data group Transition Expense !",
    });
  }
};

exports.deleteTransition = async (req, res) => {
  const { account_transition_id } = req.params;
  try {
    const query = `DELETE FROM account_transition WHERE account_transition_id = ?`;
    const [result, err] = await sql.query(query, [account_transition_id]);

    if (err) {
      console.error("Delete transition error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Transition not found" });
    }
    res
      .status(200)
      .json({ message: "Transition deleted successfully", result });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.get_Bank_Transition = async (req, res) => {
  const user_auth = getUserFromToken(req);
  const user_id = user_auth.account_user_id;
  try {
    const query = `SELECT
                  \`at\`.account_type_id, 
                  \`at\`.account_type_name, 
                  at_trans.account_type_from_id, 
                  at_trans.account_transition_id, 
                  at_trans.account_type_id, 
                  at_trans.account_transition_value, 
                  at_trans.account_category_id, 
                  at_trans.account_category_from_id, 
                  at_from.account_type_name AS account_type_from_name
                FROM
                  account_transition AS at_trans
                  INNER JOIN account_type AS \`at\`
                    ON at_trans.account_type_id = \`at\`.account_type_id
                  INNER JOIN account_type AS at_from
                    ON at_trans.account_type_from_id = at_from.account_type_id
                  INNER JOIN account_user
                  INNER JOIN account_group
                    ON account_user.account_user_id = account_group.account_user_id
                    AND \`at\`.account_group_id = account_group.account_group_id
                WHERE
                  at_trans.account_category_id = ?
                  AND at_trans.account_category_from_id = ?
                  AND account_group.account_user_id = ?
                ORDER BY
                  at_trans.account_transition_id DESC;
                    `;
    const [data_transition_bank] = await sql.query(query, [7, 1, user_id]);
    if (!data_transition_bank && data_transition_bank.length === 0) {
      return res.status(404).json({ error: "Transition not found" });
    }
    res.json({ data_transition_bank }).status(200);
  } catch (err) {
    res.json({ err: err.massage });
  }
};

exports.get_Creditor_Transition = async (req, res) => {
  const user_auth = getUserFromToken(req);
  const user_id = user_auth.account_user_id;
  try {
    const query = `
      SELECT
        \`at\`.account_type_id, 
        \`at\`.account_type_name, 
        at_trans.account_type_from_id, 
        at_trans.account_transition_id, 
        at_trans.account_type_id, 
        at_trans.account_transition_value, 
        at_trans.account_category_id, 
        at_trans.account_category_from_id, 
        at_from.account_type_name AS account_type_from_name
      FROM
        account_transition AS at_trans
        INNER JOIN account_type AS \`at\` ON at_trans.account_type_id = \`at\`.account_type_id
        INNER JOIN account_type AS at_from ON at_trans.account_type_from_id = at_from.account_type_id
        INNER JOIN account_user
        INNER JOIN account_group ON account_user.account_user_id = account_group.account_user_id
          AND \`at\`.account_group_id = account_group.account_group_id
      WHERE
        at_trans.account_category_id IN (?, ?)
        AND at_trans.account_category_from_id IN (?, ?)
        AND account_group.account_user_id = ? 
      ORDER BY
        at_trans.account_transition_id DESC
    `;
    
    const [data_transition_bank] = await sql.query(query, [2, 1, 2, 1, user_id]);

    res.status(200).json({ data_transition_bank });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.get_Debtor_Transition = async (req, res) => {
  const user_auth = getUserFromToken(req);
  const user_id = user_auth.account_user_id;
  try {
    const query = `
      SELECT
        \`at\`.account_type_id, 
        \`at\`.account_type_name, 
        at_trans.account_type_from_id, 
        at_trans.account_transition_id, 
        at_trans.account_type_id, 
        at_trans.account_transition_value, 
        at_trans.account_category_id, 
        at_trans.account_category_from_id, 
        at_from.account_type_name AS account_type_from_name
      FROM
        account_transition AS at_trans
        INNER JOIN account_type AS \`at\` ON at_trans.account_type_id = \`at\`.account_type_id
        INNER JOIN account_type AS at_from ON at_trans.account_type_from_id = at_from.account_type_id
        INNER JOIN account_user
        INNER JOIN account_group ON account_user.account_user_id = account_group.account_user_id
          AND \`at\`.account_group_id = account_group.account_group_id
      WHERE
        at_trans.account_category_id IN (?, ?)
        AND at_trans.account_category_from_id IN (?, ?)
        AND account_group.account_user_id = ? 
      ORDER BY
        at_trans.account_transition_id DESC
    `;
    
    const [data_transition_bank] = await sql.query(query, [6, 1, 6, 1, user_id]);

    res.status(200).json({ data_transition_bank });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


exports.delete_transition_expense = async (req, res) => {
  const { account_transition_id } = req.params;
  const { account_transition_value } = req.body;

  console.log(
    "transition delete : ",
    account_transition_id,
    "\n" + "transition value reuse : ",
    account_transition_value
  );

  try {
    const select_transition = `SELECT account_type_from_id FROM account_transition WHERE account_transition_id = ?`;
    const [res_transition] = await sql.query(select_transition, [
      account_transition_id,
    ]);

    console.log(res_transition[0].account_type_from_id);
    const id_type = res_transition[0].account_type_from_id;

    const update_typetotal = `UPDATE account_type SET account_type_total = account_type_total + ? WHERE account_type_id = ?`;
    const [success, error] = await sql.query(update_typetotal, [
      account_transition_value,
      id_type,
    ]);

    if (error) {
      res,
        json({
          error: error.massage,
        }).status(500);
    } else {
      const type_type_id_ = `SELECT account_type_id FROM account_transition WHERE account_transition_id = ?`;
      const [res_type_type_id] = await sql.query(type_type_id_, [
        account_transition_id,
      ]);
      // console.log(res_type_type_id[0].account_type_id);

      const type_type_id_reuse_value = res_type_type_id[0].account_type_id;

      const update_type_total =
        "UPDATE account_type SET account_type_total = account_type_total - ? WHERE account_type_id  = ?";
      await sql.query(update_type_total, [account_transition_value,type_type_id_reuse_value]);

      const query = `DELETE FROM account_transition WHERE account_transition_id = ?`;
      const [result, err] = await sql.query(query, [account_transition_id]);

      if (err) {
        console.error("Delete transition error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Transition not found" });
      }
      res.status(200).json({
        message: "Transition deleted successfully",
        result,
        massage: success,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.delete_transition_income = async (req, res) => {
  const { account_transition_id } = req.params;
  const { account_transition_value } = req.body;

  console.log(
    "transition delete : ",
    account_transition_id,
    "\n" + "transition value reuse : ",
    account_transition_value
  );

  try {
    const select_transition = `SELECT account_type_from_id FROM account_transition WHERE account_transition_id = ?`;
    const [res_transition] = await sql.query(select_transition, [
      account_transition_id,
    ]);

    console.log(res_transition[0].account_type_from_id);
    const id_type = res_transition[0].account_type_from_id;

    const update_typetotal = `UPDATE account_type SET account_type_total = account_type_total - ? WHERE account_type_id = ?`;
    const [success, error] = await sql.query(update_typetotal, [
      account_transition_value,
      id_type,
    ]);

    if (error) {
      res,
        json({
          error: error.massage,
        }).status(500);
    } else {
      // ดึง account type มา สั่ง คืนค่า
      const type_type_id_ = `SELECT account_type_id FROM account_transition WHERE account_transition_id = ?`;
      const [res_type_type_id] = await sql.query(type_type_id_, [
        account_transition_id,
      ]);
      // console.log(res_type_type_id[0].account_type_id);

      const type_type_id_reuse_value = res_type_type_id[0].account_type_id;

      const update_type_total =
        "UPDATE account_type SET account_type_total = account_type_total = 0 WHERE account_type_id  = ?";
      await sql.query(update_type_total, [type_type_id_reuse_value]);

      const query = `DELETE FROM account_transition WHERE account_transition_id = ?`;
      const [result, err] = await sql.query(query, [account_transition_id]);
      if (err) {
        console.error("Delete transition error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Transition not found" });
      }
      res.status(200).json({
        message: "Transition deleted successfully",
        result,
        massage: success,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};
