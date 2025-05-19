const sql = require("../database/db");
const jwt = require("jsonwebtoken");
const { getUserFromToken } = require("../utils/authUtils");
exports.openAccount = async (req, res) => {
  try {
    const {
      account_type_id,
      account_transition_value,
      account_transition_start = 1,
      account_category_from_id,
    } = req.body;

    // Optional: calculate max start value
    const maxQuery = `
      SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
      FROM account_transition
      WHERE account_transition_submit = 1
    `;
    const [maxResult] = await sql.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    // Step 1: Check for duplicate
    const [existing] = await sql.query(
      `SELECT * FROM account_transition WHERE account_type_id = ? AND account_transition_start = ?`,
      [account_type_id, newStartValue]
    );

    let query, values;

    // Step 2: Build query
    if (existing.length > 0) {
      // Record exists → UPDATE
      switch (account_category_from_id) {
        case 1:
        case 6:
        case 7:
          query = `
            UPDATE account_transition
            SET account_transition_value = ?, account_transition_datetime = NOW(), account_type_dr_id = ?
            WHERE account_type_id = ? AND account_transition_start = ?
          `;
          values = [account_transition_value, account_type_id, account_type_id, newStartValue];
          break;
        case 2:
        case 3:
          query = `
            UPDATE account_transition
            SET account_transition_value = ?, account_transition_datetime = NOW(), account_type_cr_id = ?
            WHERE account_type_id = ? AND account_transition_start = ?
          `;
          values = [account_transition_value, account_type_id, account_type_id, newStartValue];
          break;
        default:
          return res.status(400).json({ error: "Invalid account category." });
      }
    } else {
      // Record does not exist → INSERT
      switch (account_category_from_id) {
        case 1:
        case 6:
        case 7:
          query = `
            INSERT INTO account_transition 
            (account_type_id, account_transition_value, account_transition_datetime, account_transition_start, account_type_dr_id)
            VALUES (?, ?, NOW(), ?, ?)
          `;
          values = [account_type_id, account_transition_value, newStartValue, account_type_id];
          break;
        case 2:
        case 3:
          query = `
            INSERT INTO account_transition 
            (account_type_id, account_transition_value, account_transition_datetime, account_transition_start, account_type_cr_id)
            VALUES (?, ?, NOW(), ?, ?)
          `;
          values = [account_type_id, account_transition_value, newStartValue, account_type_id];
          break;
        default:
          return res.status(400).json({ error: "Invalid account category." });
      }
    }

    // Step 3: Execute insert or update
    await sql.query(query, values);

    res.status(200).json({ message: existing.length > 0 ? "Account transition updated." : "Account transition inserted." });

  } catch (error) {
    console.error("Error inserting/updating account transition:", error);
    res.status(500).json({ error: "Server error processing account transition." });
  }
};

exports.sumAccount = async (req, res) => {
  try {
    const { account_transition_value } = req.body;
    // get user_id
    const user = getUserFromToken(req);

    // user_id
    if (!user || !user.account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }

    const account_user_id = user.account_user_id;
    const account_group_id = `SELECT
                                account_group.account_group_id, 
                                account_group.account_user_id
                              FROM
                                account_group
                              WHERE
                                account_group.account_user_id = ? 
                                AND
                                account_group.account_category_id = 3 `;
    const [group] = await sql.query(account_group_id, [account_user_id]);
    const account_group_id_select = group[0].account_group_id;

    const account_type_id_query = `SELECT
                                    account_type.account_type_id, 
                                    account_type.account_group_id
                                  FROM
                                    account_type
                                  WHERE
                                    account_type.account_group_id = ?`;

    const [type] = await sql.query(account_type_id_query, [
      account_group_id_select,
    ]);

    const account_type_id = type[0].account_type_id;

    const maxQuery = `
      SELECT COALESCE(MAX(account_transition_start), 0)+1 AS max_start
      FROM account_transition
      WHERE account_transition_submit = 1
    `;

    const [maxResult] = await sql.query(maxQuery);
    const newStartValue = maxResult[0].max_start;

    const query = `
        INSERT INTO account_transition 
        (
        account_type_id, 
        account_transition_value, 
        account_transition_datetime, 
        account_transition_start
        )
        VALUES (?, ?, NOW(), ?) 
      `;

    await sql.query(query, [
      account_type_id,
      account_transition_value,
      newStartValue,
    ]);

    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  }
};

exports.sumbitTransition = async (req, res) => {
  try {
    const query = `
      UPDATE account_transition
      SET account_transition_submit = 1
      WHERE account_transition.account_type_from_id IS NULL
      AND account_transition.account_category_from_id IS NULL;
    `;
    await sql.query(query);

    const account_type_id_query = `SELECT
                                        at.account_type_id
                                      FROM
                                          account_transition AS at
                                      JOIN (
                                          SELECT 
                                              MAX(account_transition_id) AS latest_id
                                          FROM 
                                              account_transition
                                      ) AS latest ON at.account_transition_id = latest.latest_id
                                      JOIN
                                          account_type AS act ON at.account_type_id = act.account_type_id
                                      GROUP BY 
                                          act.account_type_name, at.account_type_id;
          `;
    const [results_type_id] = await sql.query(account_type_id_query);
    const account_type_cr_id = results_type_id[0].account_type_id;

    console.log("account_type_cr_id", account_type_cr_id);

    const submit_cr_type_query = `
      UPDATE account_transition
      SET account_type_cr_id = ?
      WHERE account_type_id = ?;
    `;
    await sql.query(submit_cr_type_query, [
      account_type_cr_id,
      account_type_cr_id,
    ]);

    const query_sumvalueType = `
      SELECT
        account_type.account_type_name, 
        account_transition.account_type_id, 
        SUM(account_transition.account_transition_value) AS SUMGROUP_TYPE
      FROM
        account_type
      INNER JOIN
        account_transition
      ON 
        account_type.account_type_id = account_transition.account_type_id
      
      GROUP BY account_type.account_type_id
    `;
    const [results] = await sql.query(query_sumvalueType);

    const updateQuery =
      "UPDATE account_type SET account_type_sum = ?, account_type_total = ? WHERE account_type_id = ?";

    // loop id มา update
    for (const result of results) {
      // รับ ตัวแปล ที่เป็น Database ได้ แบบนี้ กูพึ่งรู้
      const { SUMGROUP_TYPE, account_type_id } = result;
      await sql.query(updateQuery, [
        SUMGROUP_TYPE,
        SUMGROUP_TYPE,
        account_type_id,
      ]);
    }

    res.status(200).json({
      message: "Account transition submitted and sums updated successfully.",
    });
  } catch (error) {
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  }
};

// debug getTransaction
exports.getTransaction = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    const account_user_id = user.account_user_id;
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
  const account_user_id = user.account_user_id;
  try {
    const user = getUserFromToken(req);
    const account_user_id = user.account_user_id;
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
        account_group.account_user_id = ? 
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
    const account_user_id = user.account_user_id;
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
        account_group.account_user_id = ? 
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
    const account_user_id = user.account_user_id;
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
    const account_user_id = user.account_user_id;
    const [res_transitiongroup] = await sql.query(
      `
      SELECT
    SUM(account_transition.account_transition_value) AS total_transition_value,
    account_group.account_category_id
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
          account_transition.account_transition_submit IS NULL AND
          account_transition.account_type_from_id IS NULL AND
          account_transition.account_category_from_id IS NULL AND
          account_group.account_user_id = ? 
      GROUP BY
          account_group.account_category_id;
    `,
      [account_user_id]
    );
    res.json(res_transitiongroup).status(200);
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
