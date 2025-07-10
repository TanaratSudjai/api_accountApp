const sql = require("../database/db");
const { getUserFromToken } = require("../utils/authUtils");

exports.reportAccount = async (req, res) => {
  try {
    const qurey = `SELECT
                  account_type.account_type_id,
                      account_category.account_category_id, 
                      account_category.account_category_name, 
                      account_type.account_type_name,
                      COALESCE(SUM(account_transition.account_transition_value), 0) AS total_value
                  FROM
                      account_type
                  INNER JOIN
                      account_group
                      ON account_type.account_group_id = account_group.account_group_id
                  INNER JOIN
                      account_category
                      ON account_group.account_category_id = account_category.account_category_id
                  LEFT JOIN
                      account_transition
                      ON account_type.account_type_id = account_transition.account_type_id
                  GROUP BY
                      account_category.account_category_id, 
                      account_category.account_category_name, 
                      account_type.account_type_name
                  ORDER BY
                      account_category.account_category_id ASC;

        `;
    const [result] = await sql.query(qurey);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.sumExpense = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  try {
    const { day, month, year } = req.query;

    // Base query
    let query = `
      SELECT SUM(account_transition.account_transition_value) AS total_expense, account_type.account_type_name 
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = 5 AND account_user.account_user_id = ${account_user_id}
    `;

    const queryParams = [];

    // Add filters dynamically
    if (year) {
      query += ` AND YEAR(account_transition.account_transition_datetime) = ?`;
      queryParams.push(year);
    }

    if (month) {
      query += ` AND MONTH(account_transition.account_transition_datetime) = ?`;
      queryParams.push(month);
    }

    if (day) {
      query += ` AND DAY(account_transition.account_transition_datetime) = ?`;
      queryParams.push(day);
    }

    query += ` GROUP BY account_type.account_type_name`;

    const [result] = await sql.query(query, queryParams);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};
exports.sumIncome = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  try {
    const { day, month, year } = req.query;

    // Base query
    let query = `
      SELECT SUM(account_transition.account_transition_value) AS total_expense, account_type.account_type_name 
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = 4 AND account_user.account_user_id = ${account_user_id}
    `;

    const queryParams = [];

    // Add filters dynamically
    if (year) {
      query += ` AND YEAR(account_transition.account_transition_datetime) = ?`;
      queryParams.push(year);
    }

    if (month) {
      query += ` AND MONTH(account_transition.account_transition_datetime) = ?`;
      queryParams.push(month);
    }

    if (day) {
      query += ` AND DAY(account_transition.account_transition_datetime) = ?`;
      queryParams.push(day);
    }

    query += ` GROUP BY account_type.account_type_name`;

    const [result] = await sql.query(query, queryParams);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.sumExpenseDaily = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  try {
    // Base query
    let query = `
            SELECT 
            DATE(account_transition.account_transition_datetime) AS date,
            SUM(account_transition.account_transition_value) AS total
          FROM account_transition 
          LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
          LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
          LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
          WHERE account_transition.account_category_id = 5 AND account_user.account_user_id = ${account_user_id}
          GROUP BY DATE(account_transition.account_transition_datetime)
          ORDER BY date ASC;
    `;

    const [result] = await sql.query(query);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};
exports.sumIncomeDaily = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  try {
    // Base query
    let query = `
            SELECT 
            DATE(account_transition.account_transition_datetime) AS date,
            SUM(account_transition.account_transition_value) AS total
          FROM account_transition 
          LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
          LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
          LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
          WHERE account_transition.account_category_id = 4 AND account_user.account_user_id = ${account_user_id}
          GROUP BY DATE(account_transition.account_transition_datetime)
          ORDER BY date ASC;
    `;

    const [result] = await sql.query(query);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.sumExpenseMonthAndYear = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  const { day, month, year } = req.query;

  try {
    let query = `
      SELECT 
        DATE(account_transition.account_transition_datetime) AS date,
        SUM(account_transition.account_transition_value) AS total
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = ? AND account_user.account_user_id = ?
    `;

    const queryParams = [5, account_user_id];

    if (year) {
      query += ` AND YEAR(account_transition.account_transition_datetime) = ?`;
      queryParams.push(year);
    }

    if (month) {
      query += ` AND MONTH(account_transition.account_transition_datetime) = ?`;
      queryParams.push(month);
    }

    if (day) {
      query += ` AND DAY(account_transition.account_transition_datetime) = ?`;
      queryParams.push(day);
    }

    query += `
      GROUP BY DATE(account_transition.account_transition_datetime)
      ORDER BY date ASC
    `;

    const [result] = await sql.query(query, queryParams);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.sumIncomeMonthAndYear = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user?.account_user_id;
  const { day, month, year } = req.query;

  try {
    let query = `
      SELECT 
        DATE(account_transition.account_transition_datetime) AS date,
        SUM(account_transition.account_transition_value) AS total
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = ? AND account_user.account_user_id = ?
    `;

    const queryParams = [4, account_user_id];

    if (year) {
      query += ` AND YEAR(account_transition.account_transition_datetime) = ?`;
      queryParams.push(year);
    }

    if (month) {
      query += ` AND MONTH(account_transition.account_transition_datetime) = ?`;
      queryParams.push(month);
    }

    if (day) {
      query += ` AND DAY(account_transition.account_transition_datetime) = ?`;
      queryParams.push(day);
    }

    query += `
      GROUP BY DATE(account_transition.account_transition_datetime)
      ORDER BY date ASC
    `;

    const [result] = await sql.query(query, queryParams);
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};
