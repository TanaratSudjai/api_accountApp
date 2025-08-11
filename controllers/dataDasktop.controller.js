const sql = require("../database/db");
const { query_typename } = require("../models/dataDasktopModal");
const jwt = require("jsonwebtoken");

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
    INNER JOIN account_category
        ON account_group.account_category_id = account_category.account_category_id
    INNER JOIN account_type
        ON account_type.account_group_id = account_group.account_group_id
WHERE 
    account_group.account_user_id = ?
ORDER BY 
    CASE account_category.account_category_id
        WHEN 1 THEN 1
        WHEN 6 THEN 2
        WHEN 7 THEN 3
        WHEN 2 THEN 4
        WHEN 3 THEN 5
        WHEN 4 THEN 6
        WHEN 5 THEN 7
        ELSE 8
    END,
    account_type.account_group_id ASC,
    account_type.account_type_id ASC, 
    account_type.account_type_name ASC;

  `;

  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    const [rows] = await sql.query(query, [account_user_id]);

    res.status(200).json({ account_type_sum: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.get_zero_value = async (req, res) => {
  
  const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;

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
        INNER JOIN account_category
            ON account_group.account_category_id = account_category.account_category_id
        INNER JOIN account_type
            ON account_type.account_group_id = account_group.account_group_id
    WHERE 
        account_type.account_type_sum <> 0 AND
        account_group.account_user_id = ?
    ORDER BY 
        CASE account_category.account_category_id
            WHEN 1 THEN 1
            WHEN 6 THEN 2
            WHEN 7 THEN 3
            WHEN 2 THEN 4
            WHEN 3 THEN 5
            WHEN 4 THEN 6
            WHEN 5 THEN 7
            ELSE 8
        END,
        account_type.account_group_id ASC,
        account_type.account_type_id ASC, 
        account_type.account_type_name ASC;
`;

  try {
    const [rows] = await sql.query(query, [account_user_id]);

    res.status(200).json({ account_type_sum: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
