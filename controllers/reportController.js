const sql = require("../database/db");

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
