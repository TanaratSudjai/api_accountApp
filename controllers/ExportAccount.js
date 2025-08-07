const sql = require("../database/db");
const jwt = require("jsonwebtoken");

exports.CloseAccount = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();

    const token = req.cookies.token;
    const userId = jwt.decode(token)?.account_user_id;
    if (!userId) {
      await connection.rollback();
      return res.status(401).json({ message: "Unauthorized or missing user ID" });
    }

    // 1. Get total income (category 4)
    const [incomeRows] = await connection.query(
      `
      SELECT SUM(account_type.account_type_sum) as totalIncome
      FROM account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_user.account_user_id = ? AND account_type.account_category_id = 4
      `,
      [userId]
    );

    // 2. Get total expense (category 5)
    const [expenseRows] = await connection.query(
      `
      SELECT SUM(account_type.account_type_sum) as totalExpense
      FROM account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_user.account_user_id = ? AND account_type.account_category_id = 5
      `,
      [userId]
    );

    const totalIncome = incomeRows[0].totalIncome || 0;
    const totalExpense = expenseRows[0].totalExpense || 0;
    const netProfit = totalIncome - totalExpense;

    // 3. Update fund (category 3)
    await connection.query(
      `
      UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = account_type.account_type_sum + ?, 
          account_type.account_type_total = account_type.account_type_total + ?
      WHERE account_user.account_user_id = ? AND account_type.account_category_id = 3
      `,
      [netProfit, netProfit, userId]
    );

    // 4. Get closing data
    const [rows] = await connection.query(
      `SELECT
        account_category.account_category_id, 
        account_category.account_category_name, 
        account_group.account_group_id, 
        account_group.account_group_name, 
        account_type.account_type_id, 
        account_type.account_type_name, 
        account_type.account_type_sum
      FROM
        account_category
      JOIN account_group 
        ON account_category.account_category_id = account_group.account_category_id
      JOIN account_type 
        ON account_group.account_group_id = account_type.account_group_id
      JOIN account_user 
        ON account_group.account_user_id = account_user.account_user_id
      WHERE
        account_user.account_user_id = ?
      ORDER BY 
        FIELD(account_category.account_category_id, 1, 6, 7, 2, 3, 4, 5),
        account_group.account_group_id,
        account_type.account_type_id
      `,
      [userId]
    );

    // Merge and format result
    const mergedCategoryIds = [1, 6, 7];
    const result = [];
    const categoryMap = new Map();
    const mergedKey = "1";
    for (const row of rows) {
      const categoryId = row.account_category_id;
      const categoryKey = mergedCategoryIds.includes(categoryId)
        ? mergedKey
        : categoryId;
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          account_category_id:
            categoryKey === mergedKey ? mergedKey : categoryId,
          account_category_name:
            categoryKey === mergedKey
              ? "หมวดรวม (1,6,7)"
              : row.account_category_name,
          groups: new Map(),
        });
      }
      const category = categoryMap.get(categoryKey);
      if (!category.groups.has(row.account_group_id)) {
        category.groups.set(row.account_group_id, {
          group_id: row.account_group_id,
          group_name: row.account_group_name,
          types: [],
        });
      }
      category.groups.get(row.account_group_id).types.push({
        type_id: row.account_type_id,
        type_name: row.account_type_name,
        sum: row.account_type_sum,
      });
    }
    for (const category of categoryMap.values()) {
      result.push({
        account_category_id: category.account_category_id,
        account_category_name: category.account_category_name,
        groups: Array.from(category.groups.values()),
      });
    }

    // 5. Insert closing record
    await connection.query(
      `INSERT INTO account_closing 
        (account_user_id, account_closing_time, account_closing_data, account_closing_income, account_closing_expence)
      VALUES (?, NOW(), ?, ?, ?)`,
      [
        userId,
        JSON.stringify(result),
        totalIncome,
        totalExpense,
      ]
    );

    // 6. Reset categories 4 and 5
    await connection.query(
      `
      UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = 0, 
          account_type.account_type_total = 0
      WHERE account_user.account_user_id = ? AND account_type.account_category_id IN (4,5)
      `,
      [userId]
    );

    // 7. Mark transitions as closed
    await connection.query(
      `
      UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition.account_transition_submit = 10
      WHERE account_user.account_user_id = ? AND account_transition.account_transition_submit != 10
      `,
      [userId]
    );

    await connection.commit();
    res.status(200).json({ message: "Account closed successfully" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.release();
  }
};

exports.getClosedAccount = async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = jwt.decode(token).account_user_id;

    const [rows] = await sql.query(
      `SELECT * FROM account_closing WHERE account_user_id = ? ORDER BY account_closing_time DESC`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
