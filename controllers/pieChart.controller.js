const sql = require("../database/db");
exports.getIncome = async (req, res) => {
  try {
    const query = `SELECT
                        *, 
                        account_type_name, 
                        account_type_value, 
                        account_category_id
                    FROM
                        account_type
                    WHERE
                        account_category_id = 4`;
    const response = await sql.query(query);
    res.status(200).json({ response });
  } catch (err) {
    console.error("Error fetching income data:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching income data." });
  }
};
exports.getExpanse = async (req, res) => {
  try {
    const query = `SELECT
                        *, 
                        account_type_name, 
                        account_type_value, 
                        account_category_id
                    FROM
                        account_type
                    WHERE
                        account_category_id = 5`;
    const response = await sql.query(query);
    res.status(200).json({ response });
  } catch (err) {
    console.error("Error fetching income data:", err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching income data." });
  }
};
