const sql = require("../database/db");
const jwt = require("jsonwebtoken");

exports.CloseAccount = async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = jwt.decode(token).account_user_id;

    const [incomeRows] = await sql.query(`
      SELECT SUM(account_type.account_type_sum) as totalIncome
      FROM account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_user.account_user_id = ? AND account_type.account_category_id = 4
    `, [userId]);

    // 2. ดึงยอดรายจ่าย (หมวด 5)
    const [expenseRows] = await sql.query(`
      SELECT SUM(account_type.account_type_sum) as totalExpense
      FROM account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      WHERE account_user.account_user_id = ? AND account_type.account_category_id = 5
    `, [userId]);

    const totalIncome = incomeRows[0].totalIncome || 0;
    const totalExpense = expenseRows[0].totalExpense || 0;

    const netProfit = totalIncome - totalExpense;

    console.log(incomeRows, expenseRows, netProfit);

    // 3. ปรับทุน (หมวด 3)
    await sql.query(`
      UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = account_type.account_type_sum + ?, 
          account_type.account_type_total = account_type.account_type_total + ?
      WHERE account_user.account_user_id = ? AND account_type.account_category_id = 3
    `, [netProfit, netProfit, userId]);

    // 4. ล้างหมวด 4, 5
    await sql.query(`
      UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = 0, 
          account_type.account_type_total = 0
      WHERE account_user.account_user_id = ? AND account_type.account_category_id IN (4,5)
    `, [userId]);

    // 5. ตั้งค่า transition เป็นปิดบัญชี
    await sql.query(`
      UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition.account_transition_submit = 10
      WHERE account_user.account_user_id = ? AND account_transition.account_transition_submit != 10
    `, [userId]);

    res.status(200).json({ message: "Account closed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};