const sql = require("../database/db");
const { getUserFromToken } = require("../utils/authUtils");

exports.MakeImportantToOne = async (req, res) => {
    const { account_group_id } = req.params
    try{
        const query = `update account_type set account_type_important = 1 WHERE account_group_id = ?`

        const [account_type_important_update] = await sql.query(query, [
            account_group_id,
          ]);

        if (account_type_important_update.length === 0) {
            return res.status(404).json({
              message: "Account group not found",
            });
          }
          res.status(201).json({
            message: "Group geting successfully",
            account_type_important_update,
          });
    } catch (err) {
        res.status(500).json({
            massage: "Error for geting account!",
            error: err.message,
          });
    }
}

exports.MakeImportantToZero = async (req, res) => {
    const { account_group_id } = req.params
    try{
        const query = `update account_type set account_type_important = 0 WHERE account_group_id = ?`

        const [account_type_important_update] = await sql.query(query, [
            account_group_id,
          ]);

        if (account_type_important_update.length === 0) {
            return res.status(404).json({
              message: "Account group not found",
            });
          }
          res.status(201).json({
            message: "Group geting successfully",
            account_type_important_update,
          });
    } catch (err) {
        res.status(500).json({
            massage: "Error for geting account!",
            error: err.message,
          });
    }
}

