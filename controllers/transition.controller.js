const sql = require("../database/db");
const jwt = require("jsonwebtoken");
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
    await connection.query(updateTotalQuery, [
      account_transition_value,
      account_type_id,
    ]);
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

    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

    if (!account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }

    const account_group_id_query = `
      SELECT account_group_id
      FROM account_group
      WHERE account_user_id = ? AND account_category_id = 3
    `;
    const [group] = await connection.query(account_group_id_query, [
      account_user_id,
    ]);

    if (!group.length) {
      return res.status(404).json({ error: "No account group found" });
    }

    const account_group_id_select = group[0].account_group_id;

    const account_type_id_query = `
      SELECT account_type_id
      FROM account_type
      WHERE account_group_id = ?
    `;
    const [type] = await connection.query(account_type_id_query, [
      account_group_id_select,
    ]);

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

    await connection.query(insertQuery, [
      account_type_id,
      finalValue,
      newStartValue,
    ]);
    await connection.commit();
    res.status(200).json({
      message: "Account transition inserted/updated successfully.",
      finalValue,
      details: {
        base: accountValue,
      },
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
  const connection = await sql.getConnection();
  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    if (!account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }
    await connection.beginTransaction();

    // 1. Submit all transitions for this user
    await connection.query(
      `UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition_submit = 1 
      WHERE account_user.account_user_id = ?`,
      [account_user_id]
    );

    // 2. Get latest account_type_id used in transition
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
      return res
        .status(400)
        .json({ error: "No latest account_type_id found." });
    }

    // 3. Update account_type_cr_id for the transitions
    await connection.query(
      `UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition.account_type_cr_id = ? 
      WHERE account_transition.account_type_id = ? AND account_user.account_user_id = ?`,
      [account_type_cr_id, account_type_cr_id, account_user_id]
    );

    // 4. Get the latest transition for category 3
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
    const { account_transition_value, account_type_id } =
      lasted_account_transition[0] || {};

    if (!account_transition_value || !account_type_id) {
      await connection.rollback();
      return res
        .status(400)
        .json({ error: "No valid transition found for update." });
    }

    // 5. Update sums for the latest account_type
    await connection.query(
      `UPDATE account_type SET account_type_sum = account_type_sum + ?, account_type_total = account_type_total + ? WHERE account_type_id = ?`,
      [account_transition_value, account_transition_value, account_type_id]
    );

    // 6. Update sums for all types except category 3
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const connection = await sql.getConnection();
  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    if (!account_user_id) {
      return res.status(401).json({ error: "Unauthorized or missing user ID" });
    }
    // 1. Get total count for pagination
    const [countResult] = await connection.query(
      `
      SELECT COUNT(*) AS total_count
      FROM account_transition
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_user.account_user_id = ?
      `,
      [account_user_id]
    );
    const total_count = countResult[0]?.total_count || 0;
    const total_page = Math.ceil(total_count / limit);

    // 2. Main paginated data query
    const [res_transition] = await connection.query(
      `
      SELECT account_transition.account_transition_id, 
             account_transition.account_category_id, 
             account_transition.account_transition_value,
             account_transition.account_transition_datetime,
             account_transition.account_category_from_id,
             account_type.account_type_name,
             account_type.account_type_description,
             account_type.account_type_sum
      FROM account_transition
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_user.account_user_id = ?
      ORDER BY account_transition.account_transition_id DESC
      LIMIT ? OFFSET ?
      `,
      [account_user_id, limit, offset]
    );

    // 3. Count Debter
    const [debterCount] = await connection.query(
      `
      SELECT COUNT(*) AS count_debter
      FROM account_transition
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      WHERE account_group.account_user_id = ? AND account_type.account_category_id = ?
      `,
      [account_user_id, 6]
    );

    // 4. Count Crediter
    const [crediterCount] = await connection.query(
      `
      SELECT COUNT(*) AS count_creaditer
      FROM account_transition
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      WHERE account_group.account_user_id = ? AND account_type.account_category_id = ?
      `,
      [account_user_id, 2]
    );

    // 5. Open Account Sum
    const [openAccount] = await connection.query(
      `
      SELECT SUM(account_type_sum) AS account_type_sum
      FROM account_type
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      WHERE account_group.account_user_id = ? AND account_type.account_category_id = ? 
      `,
      [account_user_id, 3]
    );

    // 6. Total Amount in Transitions
    const [amount] = await connection.query(
      `
      SELECT SUM(account_type.account_type_total) as total_amount
      FROM account_type 
      INNER JOIN account_group 
      ON account_type.account_group_id = account_group.account_group_id
      INNER JOIN account_user ON 
      account_group.account_user_id = account_user.account_user_id
      WHERE account_type.account_category_id IN (1,7) AND account_group.account_user_id = ?
      `,
      [account_user_id]
    );

    res.json({
      data: res_transition,
      total_count,
      total_page,
      page,
      limit,
      summary: [
        {
          type: "Debter",
          value: debterCount[0].count_debter,
        },
        {
          type: "Crediter",
          value: crediterCount[0].count_creaditer,
        },
        {
          type: "Open Account",
          value: openAccount[0].account_type_sum || 0,
        },
        {
          type: "Total Amount",
          value: amount[0].total_amount || 0,
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    connection.release();
  }
};

exports.getGroupTwoTransition = async (req, res) => {
  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
  const connection = await sql.getConnection();
  try {
    const [res_transitiongroup] = await connection.query(
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
        INNER JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
        INNER JOIN account_group ON account_type.account_group_id = account_group.account_group_id
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
    res.status(200).json(res_transitiongroup);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, text: "Error getting data group two!" });
  } finally {
    connection.release();
  }
};

exports.getGroupOneTransition = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    const [res_transitiongroup] = await connection.query(
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
        INNER JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
        INNER JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      WHERE
        account_group.account_category_id IN (1,6,7) AND
        account_transition_value > 0 AND
        account_transition.account_transition_submit IS NULL AND
        account_transition.account_category_id IS NULL AND
        account_group.account_user_id = ? AND
        account_transition.account_category_from_id IS NULL AND
        account_transition.account_type_from_id IS NULL
      `,
      [account_user_id]
    );
    res.status(200).json(res_transitiongroup);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, text: "Error getting data group one!" });
  } finally {
    connection.release();
  }
};

exports.getSumValueGroupOne = async (req, res) => {
  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
  const connection = await sql.getConnection();
  try {
    const [res_transitiongroup] = await connection.query(
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
        AND account_group.account_user_id = ?
      `,
      [account_user_id]
    );
    res.status(200).json(res_transitiongroup);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, text: "Error getting data group one!" });
  } finally {
    connection.release();
  }
};

exports.getSumValueGroupTwo = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    const [res_transitiongroup] = await connection.query(
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
        AND account_group.account_user_id = ?
      `,
      [account_user_id]
    );
    res.status(200).json(res_transitiongroup);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, text: "Error getting data group two!" });
  } finally {
    connection.release();
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

// Consolidated API that merges multiple functions into one endpoint

exports.getTransitionSummary = async (req, res) => {
  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

  if (!account_user_id) {
    return res.status(401).json({ error: "Unauthorized or missing user ID" });
  }

  const connection = await sql.getConnection();
  try {
    // 1. Get Group One Transitions (categories 1,6,7)
    const [groupOneTransitions] = await connection.query(
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
        INNER JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
        INNER JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      WHERE
        account_group.account_category_id IN (1,6,7) AND
        account_transition_value > 0 AND
        account_transition.account_transition_submit IS NULL AND
        account_transition.account_category_id IS NULL AND
        account_group.account_user_id = ? AND
        account_transition.account_category_from_id IS NULL AND
        account_transition.account_type_from_id IS NULL`,
      [account_user_id]
    );

    // 2. Get Group Two Transitions (category 2)
    const [groupTwoTransitions] = await connection.query(
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
        INNER JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
        INNER JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      WHERE
        account_group.account_category_id = 2 AND
        account_transition_value > 0 AND
        account_transition.account_transition_submit IS NULL AND
        account_group.account_user_id = ? AND
        account_transition.account_category_from_id IS NULL AND
        account_transition.account_type_from_id IS NULL`,
      [account_user_id]
    );

    // 3. Get Sum Value Group One
    const [sumGroupOne] = await connection.query(
      `SELECT 
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
        AND account_group.account_user_id = ?`,
      [account_user_id]
    );

    // 4. Get Sum Value Group Two
    const [sumGroupTwo] = await connection.query(
      `SELECT 
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
        AND account_group.account_user_id = ?`,
      [account_user_id]
    );

    // 5. Get Three Type Summary (from fundTotal controller)
    const [ownerSum] = await connection.query(
      `SELECT SUM(account_type_sum) as total_owner FROM account_type 
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id IN (1, 6, 7)
         AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    const [debtSum] = await connection.query(
      `SELECT SUM(account_type_sum) as total_debt FROM account_type 
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id = 2
         AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    const [fundSum] = await connection.query(
      `SELECT SUM(account_type_total) as total_fund FROM account_type 
       JOIN account_group ON account_type.account_group_id = account_group.account_group_id
       JOIN account_user ON account_group.account_user_id = account_user.account_user_id
       WHERE account_type.account_category_id = 3
         AND account_user.account_user_id = ?`,
      [account_user_id]
    );

    // 6. Get Menu Where Cat (from menu controller)
    const [menuData] = await connection.query(
      `SELECT
        account_type.account_type_id, 
        account_type.account_type_name, 
        account_type.account_type_value, 
        account_type.account_type_icon, 
        account_group.account_category_id,
        account_icon.account_icon_id,
        account_icon.account_icon_name
      FROM
        account_type
      INNER JOIN
        account_group ON account_type.account_group_id = account_group.account_group_id
      INNER JOIN
        account_icon ON account_type.account_type_icon = account_icon.account_icon_id
      WHERE
        account_group.account_category_id IN (1, 2, 6, 7)
        AND account_group.account_user_id = ?`,
      [account_user_id]
    );

    // Return consolidated response
    res.status(200).json({
      message: "Transition summary retrieved successfully",
      data: {
        groupOneTransitions,
        groupTwoTransitions,
        sumGroupOne: sumGroupOne[0]?.total_transition_value || 0,
        sumGroupTwo: sumGroupTwo[0]?.total_transition_value || 0,
        threeTypeSummary: {
          total_owner: ownerSum[0]?.total_owner || 0,
          total_debt: debtSum[0]?.total_debt || 0,
          total_fund: fundSum[0]?.total_fund || 0
        },
        menuData
      }
    });

  } catch (error) {
    console.error("Error getting transition summary:", error);
    res.status(500).json({
      error: error.message,
      text: "Error getting transition summary!"
    });
  } finally {
    connection.release();
  }
};

