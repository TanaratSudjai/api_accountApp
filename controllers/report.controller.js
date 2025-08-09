const sql = require("../database/db");
const jwt = require("jsonwebtoken");

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

exports.getDashboardReport = async (req, res) => {
  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
  if (!account_user_id) {
    return res.status(401).json({ error: "Unauthorized or missing user ID" });
  }

  const { day, month, year } = req.query;

  try {
    // 1. Daily Expense Totals
    const [dailyExpenseTotals] = await sql.query(
      `
      SELECT 
        DATE(account_transition.account_transition_datetime) AS date,
        SUM(account_transition.account_transition_value) AS total
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = 5 AND account_user.account_user_id = ?
      GROUP BY DATE(account_transition.account_transition_datetime)
      ORDER BY date ASC
      `,
      [account_user_id]
    );

    // 2. Daily Income Totals
    const [dailyIncomeTotals] = await sql.query(
      `
      SELECT 
        DATE(account_transition.account_transition_datetime) AS date,
        SUM(account_transition.account_transition_value) AS total
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = 4 AND account_user.account_user_id = ?
      GROUP BY DATE(account_transition.account_transition_datetime)
      ORDER BY date ASC
      `,
      [account_user_id]
    );

    // 3. Expense Chart (filtered by year/month/day if provided)
    let expenseChartQuery = `
      SELECT 
        SUM(t.account_transition_value) AS total_expense,
        at.account_type_id,
        at.account_type_name
      FROM account_transition t
      LEFT JOIN account_type at ON t.account_type_id = at.account_type_id
      LEFT JOIN account_group ag ON at.account_group_id = ag.account_group_id
      LEFT JOIN account_user au ON ag.account_user_id = au.account_user_id
      WHERE t.account_category_id = 5 AND au.account_user_id = ?
    `;
    const expenseChartParams = [account_user_id];
    if (year) {
      expenseChartQuery += ` AND YEAR(t.account_transition_datetime) = ?`;
      expenseChartParams.push(year);
    }
    if (month) {
      expenseChartQuery += ` AND MONTH(t.account_transition_datetime) = ?`;
      expenseChartParams.push(month);
    }
    if (day) {
      expenseChartQuery += ` AND DAY(t.account_transition_datetime) = ?`;
      expenseChartParams.push(day);
    }
    expenseChartQuery += `
       GROUP BY at.account_type_id
    `;
    const [expenseChart] = await sql.query(expenseChartQuery, expenseChartParams);

    // 4. Income Chart (filtered by year/month/day if provided)
    let incomeChartQuery = `
      SELECT 
        SUM(t.account_transition_value) AS total_income,
        at.account_type_id,
        at.account_type_name
      FROM account_transition t
      LEFT JOIN account_type at ON t.account_type_id = at.account_type_id
      LEFT JOIN account_group ag ON at.account_group_id = ag.account_group_id
      LEFT JOIN account_user au ON ag.account_user_id = au.account_user_id
      WHERE t.account_category_id = 4 AND au.account_user_id = ?
    `;
    const incomeChartParams = [account_user_id];
    if (year) {
      incomeChartQuery += ` AND YEAR(t.account_transition_datetime) = ?`;
      incomeChartParams.push(year);
    }
    if (month) {
      incomeChartQuery += ` AND MONTH(t.account_transition_datetime) = ?`;
      incomeChartParams.push(month);
    }
    if (day) {
      incomeChartQuery += ` AND DAY(t.account_transition_datetime) = ?`;
      incomeChartParams.push(day);
    }
    incomeChartQuery += `
     GROUP BY at.account_type_id
    `;
    const [incomeChart] = await sql.query(incomeChartQuery, incomeChartParams);

    // 5. MonthAndYear Income Totals
    let monthYearIncomeQuery = `
      SELECT 
        DATE(account_transition.account_transition_datetime) AS date,
        SUM(account_transition.account_transition_value) AS total
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = 4 AND account_user.account_user_id = ?
    `;
    const monthYearIncomeParams = [account_user_id];
    if (year) {
      monthYearIncomeQuery += ` AND YEAR(account_transition.account_transition_datetime) = ?`;
      monthYearIncomeParams.push(year);
    }
    if (month) {
      monthYearIncomeQuery += ` AND MONTH(account_transition.account_transition_datetime) = ?`;
      monthYearIncomeParams.push(month);
    }
    monthYearIncomeQuery += `
      GROUP BY DATE(account_transition.account_transition_datetime)
      ORDER BY date ASC
    `;
    const [monthYearIncomeTotals] = await sql.query(monthYearIncomeQuery, monthYearIncomeParams);

    // 6. MonthAndYear Expense Totals
    let monthYearExpenseQuery = `
      SELECT 
        DATE(account_transition.account_transition_datetime) AS date,
        SUM(account_transition.account_transition_value) AS total
      FROM account_transition 
      LEFT JOIN account_type ON account_transition.account_type_id = account_type.account_type_id 
      LEFT JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      LEFT JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_transition.account_category_id = 5 AND account_user.account_user_id = ?
    `;
    const monthYearExpenseParams = [account_user_id];
    if (year) {
      monthYearExpenseQuery += ` AND YEAR(account_transition.account_transition_datetime) = ?`;
      monthYearExpenseParams.push(year);
    }
    if (month) {
      monthYearExpenseQuery += ` AND MONTH(account_transition.account_transition_datetime) = ?`;
      monthYearExpenseParams.push(month);
    }
    monthYearExpenseQuery += `
      GROUP BY DATE(account_transition.account_transition_datetime)
      ORDER BY date ASC
    `;
    const [monthYearExpenseTotals] = await sql.query(monthYearExpenseQuery, monthYearExpenseParams);

    res.json({
      dailyExpenseTotals,
      dailyIncomeTotals,
      expenseChart,
      incomeChart,
      monthYearIncomeTotals,
      monthYearExpenseTotals,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
