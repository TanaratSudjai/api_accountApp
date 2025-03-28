const sql = require("../database/db");
const { query_typename } = require("../models/dataDasktopModal");
const { getUserFromToken } = require("../utils/authUtils");

exports.getNameType = async (req, res) => {
  const query = query_typename;
  try {
    const [rows] = await sql.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.get_sumvalue_type = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;

  const query = `
    SELECT
        account_type.account_type_sum, 
        account_type.account_type_name, 
        account_category.account_category_id, 
        account_type.account_type_id, 
        account_type.account_group_id, 
        account_group.account_category_id
    FROM
        account_group
        INNER JOIN  
        account_category
        ON account_group.account_category_id = account_category.account_category_id
        INNER JOIN
        account_type
        ON account_type.account_group_id = account_group.account_group_id
    WHERE 
        account_group.account_user_id = ?
    ORDER BY 
        account_type.account_category_id ASC,
        account_type.account_group_id ASC,
        account_type.account_type_id ASC, 
        account_type.account_type_name ASC
  `;

  try {
    const [rows] = await sql.query(query, [account_user_id]); 

    res.status(200).json({ account_type_sum: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.get_zero_value = async (req, res) => {
  const query = `
  SELECT
      account_type.account_type_sum, 
      account_type.account_type_name, 
      account_category.account_category_id, 
      account_type.account_type_id, 
      account_type.account_group_id, 
      account_group.account_category_id
  FROM
      account_group
      INNER JOIN  
      account_category
      ON 
          account_group.account_category_id = account_category.account_category_id
      INNER JOIN
      account_type
      ON 
          account_type.account_group_id = account_group.account_group_id
  WHERE 
      account_type.account_type_sum <> 0
  ORDER BY 
      account_type.account_group_id ASC ,
      account_type.account_type_id ASC, 
      account_type.account_type_name ASC;

`;

  try {
    const [rows] = await sql.query(query);

    res.status(200).json({ account_type_sum: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
