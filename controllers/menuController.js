const sql = require("../database/db");

exports.getMenuWhereCat = async (req, res) => {
  const qurey = `SELECT
	account_type.account_type_id, 
	account_type.account_type_name, 
	account_type.account_type_value, 
	account_type.account_type_icon, 
	account_group.account_category_id
    FROM
        account_type
        INNER JOIN
        account_group
        ON 
            account_type.account_group_id = account_group.account_group_id
    WHERE
        account_group.account_category_id <= 2`;

  const [data_menu] = await sql.query(qurey);
  res.status(201).json({
    message: "Geting menu where cat successfully",
    data_menu,
  });
};

exports.getMenuFF = async (req, res) => {
  const qurey = `SELECT
	account_type.account_type_id, 
	account_type.account_type_name, 
	account_type.account_type_value, 
	account_type.account_type_icon, 
	account_group.account_category_id
    FROM
        account_type
        INNER JOIN
        account_group
        ON 
            account_type.account_group_id = account_group.account_group_id
    WHERE
        account_group.account_category_id = 4 || account_group.account_category_id = 5`;

  const [data_menu] = await sql.query(qurey);
  res.status(201).json({
    message: "Geting menu where cat successfully",
    data_menu,
  });
};
