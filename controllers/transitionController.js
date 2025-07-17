const sql = require("../database/db");
const jwt = require("jsonwebtoken");
const { getUserFromToken } = require("../utils/authUtils");
exports.openAccount = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const {
      account_type_id,
      account_transition_value,
      account_transition_start = 1,
      account_category_from_id,
    } = req.body;

    const maxQuery = `
      SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
      FROM account_transition
      WHERE account_transition_submit = 1
    `;
    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    // Step 1: Check for duplicate
    const [existing] = await connection.query(
      `SELECT * FROM account_transition WHERE account_type_id = ? AND account_transition_start = ?`,
      [account_type_id, newStartValue]
    );

    let query, values;

    // Step 2: Build insert/update query
    if (existing.length > 0) {
      switch (account_category_from_id) {
        case 1:
        case 6:
        case 7:
          query = `
            UPDATE account_transition
            SET account_transition_value = ?, account_transition_datetime = NOW(), account_type_dr_id = ?
            WHERE account_type_id = ? AND account_transition_start = ?
          `;
          values = [
            account_transition_value,
            account_type_id,
            account_type_id,
            newStartValue,
          ];
          break;
        case 2:
        case 3:
          query = `
            UPDATE account_transition
            SET account_transition_value = ?, account_transition_datetime = NOW(), account_type_cr_id = ?
            WHERE account_type_id = ? AND account_transition_start = ?
          `;
          values = [
            account_transition_value,
            account_type_id,
            account_type_id,
            newStartValue,
          ];
          break;
        default:
          return res.status(400).json({ error: "Invalid account category." });
      }
    } else {
      switch (account_category_from_id) {
        case 1:
        case 6:
        case 7:
          query = `
            INSERT INTO account_transition 
            (account_type_id, account_transition_value, account_transition_datetime, account_transition_start, account_type_dr_id)
            VALUES (?, ?, NOW(), ?, ?)
          `;
          values = [
            account_type_id,
            account_transition_value,
            newStartValue,
            account_type_id,
          ];
          break;
        case 2:
        case 3:
          query = `
            INSERT INTO account_transition 
            (account_type_id, account_transition_value, account_transition_datetime, account_transition_start, account_type_cr_id)
            VALUES (?, ?, NOW(), ?, ?)
          `;
          values = [
            account_type_id,
            account_transition_value,
            newStartValue,
            account_type_id,
          ];
          break;
        default:
          return res.status(400).json({ error: "Invalid account category." });
      }
    }

    // Step 3: Execute insert or update
    await connection.query(query, values);

    // Step 4: Update account_type_total
    const updateTotalQuery = `
      UPDATE account_type
      SET account_type_total = account_type_total + ?
      WHERE account_type_id = ?
    `;
    await connection.query(updateTotalQuery, [account_transition_value, account_type_id]);
    await connection.commit();
    res.status(200).json({
      message:
        existing.length > 0
          ? "Account transition updated and total increased."
          : "Account transition inserted and total increased.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting/updating account transition:", error);
    res
      .status(500)
      .json({ error: "Server error processing account transition." });
  } finally {
    connection.release();
  }
};

exports.sumAccount = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const { account_transition_value } = req.body;

    const user = getUserFromToken(req);

    if (!user || !user.account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }

    const account_user_id = user?.account_user_id;

    const account_group_id_query = `
      SELECT account_group_id
      FROM account_group
      WHERE account_user_id = ? AND account_category_id = 3
    `;
    const [group] = await connection.query(account_group_id_query, [account_user_id]);

    if (!group.length) {
      return res.status(404).json({ error: "No account group found" });
    }

    const account_group_id_select = group[0].account_group_id;

    const account_type_id_query = `
      SELECT account_type_id
      FROM account_type
      WHERE account_group_id = ?
    `;
    const [type] = await connection.query(account_type_id_query, [account_group_id_select]);

    if (!type.length) {
      return res.status(404).json({ error: "No account type found" });
    }

    const account_type_id = type[0].account_type_id;

    const maxQuery = `
      SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
      FROM account_transition
      WHERE account_transition_submit = 1
    `;
    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start;

    const accountValue = parseFloat(account_transition_value) || 0;
    const finalValue = accountValue;

    const insertQuery = `
      INSERT INTO account_transition 
      (
        account_type_id, 
        account_transition_value, 
        account_transition_datetime, 
        account_transition_start
      )
      VALUES (?, ?, NOW(), ?)
    `;

    await connection.query(insertQuery, [account_type_id, finalValue, newStartValue]);
    await connection.commit();
    res.status(200).json({
      message: "Account transition inserted/updated successfully.",
      finalValue,
      details: {
        base: accountValue
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};

exports.sumbitTransition = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
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
      return res
        .status(400)
        .json({ error: "No latest account_type_id found." });
    }

    // Update account_type_cr_id for the transitions
    await connection.query(
      `UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition.account_type_cr_id = ? 
      WHERE account_transition.account_type_id = ? AND account_user.account_user_id = ? `,
      [account_type_cr_id, account_type_cr_id, account_user_id]
    );

    const get_lasted_account_transition = `
      SELECT 
          account_transition.account_transition_id,
          account_transition.account_type_id,
          account_transition.account_transition_value 
      FROM
          account_user
          INNER JOIN account_group ON account_user.account_user_id = account_group.account_user_id
          INNER JOIN account_type ON account_group.account_group_id = account_type.account_group_id
          INNER JOIN account_transition ON account_type.account_type_id = account_transition.account_type_id
      WHERE
          account_user.account_user_id = ?
          AND account_group.account_category_id = 3
      ORDER BY
          account_transition.account_transition_id DESC
      LIMIT 1;
    `;

    const [lasted_account_transition] = await connection.query(
      get_lasted_account_transition,
      [account_user_id]
    );

    const { account_transition_value, account_type_id } = lasted_account_transition[0] || {};

    console.log(account_transition_value, account_type_id);

    await connection.query(
      `UPDATE account_type SET account_type_sum = account_type_sum + ?, account_type_total = account_type_total + ? WHERE account_type_id = ?`,
      [account_transition_value, account_transition_value, account_type_id]
    );

    await connection.query(
      `UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = account_type.account_type_total 
      WHERE account_type.account_category_id != 3 AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    await connection.commit();
    res.status(200).json({
      message: "Account transition submitted and sums updated successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};

// debug getTransaction
exports.getTransaction = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const account_user_id = user?.account_user_id;
    if (!user || !user.account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }
    const [res_transition] = await sql.query(
      `SELECT
        account_transition.*, 
        account_transition.account_transition_id, 
        account_transition.account_type_id, 
        account_transition.account_category_id, 
        account_transition.account_transition_value, 
        account_transition.account_transition_datetime, 
        account_transition.account_transition_start, 
        account_transition.account_type_from_id, 
        account_transition.account_transition_submit, 
        account_transition.account_category_from_id, 
        account_transition.account_type_dr_id, 
        account_transition.account_type_cr_id, 
        account_type.account_type_id, 
        account_type.account_type_name, 
        account_type.account_type_value, 
        account_type.account_type_description, 
        account_type.account_type_from_id, 
        account_type.account_type_icon, 
        account_type.account_type_important, 
        account_type.account_type_sum, 
        account_type.account_group_id, 
        account_type.account_category_id, 
        account_type.account_type_total
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
        INNER JOIN
        account_user
        ON 
          account_group.account_user_id = account_user.account_user_id
      WHERE
        account_user.account_user_id = ?
      ORDER BY
        account_transition.account_transition_datetime DESC
       `,
      [account_user_id]
    );

    // debter count
    const [sql_debterCount] = await sql.query(
      `SELECT
                                            COUNT(account_type.account_type_id) as count_debter
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
                                                account_type.account_category_id = ? AND account_group.account_user_id = ?`,
      [6, account_user_id]
    );

    // crediter count
    const [sql_crediterCount] = await sql.query(
      `SELECT
                                            COUNT(account_type.account_type_id) as count_creaditer
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
                                                account_type.account_category_id = ? AND account_group.account_user_id = ?`,

      [2, account_user_id]
    );

    const [checkOpenAccount] = await sql.query(
      `
                                            SELECT 
                                              account_type.account_type_sum
                                            FROM
                                              account_type
                                              INNER JOIN
                                              account_group
                                            ON 
                                                account_type.account_group_id = account_group.account_group_id
                                            INNER JOIN
                                              account_user
                                            ON 
                                                account_group.account_user_id = account_user.account_user_id
                                            WHERE 
                                                account_type.account_category_id = ? AND account_group.account_user_id = ?`,

      [3, account_user_id]
    );

    // return data to client
    res.json({
      res_transition,
      data: [
        {
          type: "Debter",
          value: sql_debterCount[0].count_debter,
        },
        {
          type: "Crediter",
          value: sql_crediterCount[0].count_creaditer,
        },
        {
          type: "Open Account",
          value: checkOpenAccount[0].account_type_sum || 0,
        },
      ],
    });
  } catch (err) {
    // unauthorized
    if (err.name === "UnauthorizedError") {
      res.status(401).json({ message: "Unauthorized" });
    }
    if (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

exports.getGroupTwoTransition = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  try {
    const user = getUserFromToken(req);
    const account_user_id = user?.account_user_id;
    const [res_transitiongroup] = await sql.query(
      `SELECT
        account_transition.account_transition_id, 
        account_transition.account_type_id, 
        account_transition.account_transition_value, 
        account_transition.account_transition_datetime, 
        account_transition.account_transition_start, 
        account_transition.account_transition_submit, 
        account_group.account_category_id, 
        account_type.account_type_name, 
        account_type.account_type_icon
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
        account_group.account_category_id = 2 AND
        account_transition_value > 0 AND
        account_transition.account_transition_submit IS NULL AND
        account_group.account_user_id = ? AND
        account_transition.account_category_from_id IS NULL AND
        account_transition.account_type_from_id IS NULL
        `,
      [account_user_id]
    );
    res.json(res_transitiongroup);
  } catch (error) {
    res.json({ massage: error.massage, text: "Error geted data group two !" });
  }
};

exports.getGroupOneTransition = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const account_user_id = user?.account_user_id;
    const [res_transitiongroup] = await sql.query(
      `SELECT
        account_transition.account_transition_id, 
        account_transition.account_type_id, 
        account_transition.account_transition_value, 
        account_transition.account_transition_datetime, 
        account_transition.account_transition_start, 
        account_transition.account_transition_submit, 
        account_group.account_category_id, 
        account_type.account_type_name, 
        account_type.account_type_icon
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
        account_group.account_category_id in (1,6,7) AND
        account_transition_value > 0 AND
        account_transition.account_transition_submit IS NULL AND
        account_transition.account_category_id IS NULL AND
        account_group.account_user_id = ? AND
        account_transition.account_category_from_id IS NULL AND
        account_transition.account_type_from_id IS NULL
        `,
      [account_user_id]
    );
    res.json(res_transitiongroup);
  } catch (error) {
    res.json({ massage: error.massage, text: "Error geted data group two !" });
  }
};

exports.getSumValueGroupOne = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const account_user_id = user?.account_user_id;
    const [res_transitiongroup] = await sql.query(
      `
      SELECT 
    SUM(account_transition.account_transition_value) AS total_transition_value
FROM 
    account_transition
INNER JOIN account_type 
    ON account_transition.account_type_id = account_type.account_type_id
INNER JOIN account_group 
    ON account_type.account_group_id = account_group.account_group_id
WHERE 
    account_group.account_category_id IN (1,6,7) 
    AND account_transition.account_transition_submit IS NULL
    AND account_transition.account_type_from_id IS NULL
    AND account_transition.account_category_from_id IS NULL
    AND account_group.account_user_id = ?;
    `,
      [account_user_id]
    );
    res.json(res_transitiongroup);
  } catch (error) {
    res.json({ massage: error.massage, text: "Error geted data group One !" });
  }
};

exports.getSumValueGroupTwo = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const account_user_id = user?.account_user_id;
    const [res_transitiongroup] = await sql.query(
      `
      SELECT 
    SUM(account_transition.account_transition_value) AS total_transition_value
FROM 
    account_transition
INNER JOIN account_type 
    ON account_transition.account_type_id = account_type.account_type_id
INNER JOIN account_group 
    ON account_type.account_group_id = account_group.account_group_id
WHERE 
    account_group.account_category_id IN (2)

    AND account_transition.account_transition_submit IS NULL
    AND account_transition.account_type_from_id IS NULL
    AND account_transition.account_category_from_id IS NULL
    AND account_group.account_user_id = ?;
    `,
      [account_user_id]
    );
    res.json(res_transitiongroup);
  } catch (error) {
    res.json({ massage: error.massage, text: "Error geted data group Two !" });
  }
};

exports.getOnedeTwo = async (req, res) => {
  try {
    const [result] = await sql.query(`
      SELECT
        (
            SELECT
                SUM(account_transition.account_transition_value)
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
                account_group.account_category_id = 1
        ) -
        (
            SELECT
                SUM(account_transition.account_transition_value)
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
                account_group.account_category_id = 2
        ) AS difference;
    `);

    res.json({ result });
  } catch (error) {
    res.json({ error: error.message });
  }
};