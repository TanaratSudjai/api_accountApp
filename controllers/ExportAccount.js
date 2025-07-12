const sql = require("../database/db");
const jwt = require("jsonwebtoken");

exports.CloseAccount = async (req, res) => {
  const { value } = req.body;
  try {
    const token = req.cookies.token;
    const userId = jwt.decode(token).account_user_id;
    console.log(userId);
    console.log(value);

    if (value > 0) {
      const query = `
        UPDATE account_type 
        JOIN account_group ON account_type.account_group_id = account_group.account_group_id
        JOIN account_user ON account_group.account_user_id = account_user.account_user_id
        SET account_type.account_type_sum = account_type.account_type_sum + ?, 
            account_type.account_type_total = account_type.account_type_total + ?
        WHERE account_user.account_user_id = ?`;
      await sql.query(query, [value, value, userId]);
    } else {
      const query = `
        UPDATE account_type 
        JOIN account_group ON account_type.account_group_id = account_group.account_group_id
        JOIN account_user ON account_group.account_user_id = account_user.account_user_id
        SET account_type.account_type_sum = account_type.account_type_sum - ?, 
            account_type.account_type_total = account_type.account_type_total - ?
        WHERE account_user.account_user_id = ?`;
      await sql.query(query, [Math.abs(value), Math.abs(value), userId]);
    }

    const clearQuery = `
      UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = 0, 
          account_type.account_type_total = 0
      WHERE account_user.account_user_id = ? AND account_type.account_category_id != 3`;
    await sql.query(clearQuery, [userId]);

    const setTransitionToclose = `
      UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition.account_transition_submit = 10
      WHERE account_user.account_user_id = ? AND account_transition.account_transition_submit != 10`;
    await sql.query(setTransitionToclose, [userId]);

    res.status(200).json({ message: "Account type closed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


