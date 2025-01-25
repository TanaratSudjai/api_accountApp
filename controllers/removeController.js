const sql = require("../database/db");

exports.removeDataTransition = async (req, res) => {
  try {
    const query = "DELETE FROM account_transition ";
    await sql.query(query);
    res.status(200).json({
      message: "Removed data transition successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Removed data transition Error",
      err,
    });
  }
};
exports.removeDataType = async (req, res) => {
  try {
    const { params_id_type } = req.params;
    const query =
      "UPDATE account_type SET `account_type_sum` = 0.00, account_type_total = 0.00 WHERE `account_type_id` = ?";
    await sql.query(query, [params_id_type]);
    res.status(200).json({
      message: "Removed data type amount successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Removed data type amount Error",
      err,
    });
  }
};
