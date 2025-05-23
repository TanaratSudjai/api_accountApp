const sql = require("../database/db");
const { getUserFromToken } = require("../utils/authUtils");

exports.get_three_type = async (req, res) => {
    try{
        const [get_sum_cat_one_six_seven] = await sql.query(
            `SELECT SUM(account_type_sum) as total_owner FROM account_type WHERE account_category_id IN (1, 6, 7)`
        );

        const [get_sum_cat_two] = await sql.query(
            `SELECT SUM(account_type_sum) as total_debt FROM account_type WHERE account_category_id IN (2)`
        );

        const [get_sum_cat_three] = await sql.query(
            `SELECT SUM(account_type_total) as total_fund FROM account_type WHERE account_category_id IN (3)`
        );

        return res.status(200).json({
            message: "Geting successfully",
            get_sum_cat_one_six_seven,
            get_sum_cat_two,
            get_sum_cat_three,
        });

    }catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error creating category",
            error: err.message,
        });
    }
}

exports.sumbitPerDay = async (req, res) => {
  const user = getUserFromToken(req);
  const account_user_id = user.account_user_id;

  try {
    // Submit all transitions
    await sql.query(
      `UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition_submit = 1 
      WHERE
          account_user.account_user_id = ? 
      `,[account_user_id]
    );

    // Get latest account_type_id used in transition
    const account_type_id_query = `
      SELECT at.account_type_id
      FROM account_transition AS at
      JOIN (
        SELECT MAX(account_transition_id) AS latest_id FROM account_transition
      ) AS latest ON at.account_transition_id = latest.latest_id
      LIMIT 1;
    `;
    const [results_type_id] = await sql.query(account_type_id_query);
    const account_type_cr_id = results_type_id[0]?.account_type_id;

    if (!account_type_cr_id) {
      return res
        .status(400)
        .json({ error: "No latest account_type_id found." });
    }

    // Update account_type_cr_id for the transitions

    await sql.query(
      `UPDATE account_transition 
      JOIN account_type ON account_transition.account_type_id = account_type.account_type_id
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_transition.account_type_cr_id = ? 
      WHERE account_transition.account_type_id = ? AND account_user.account_user_id = ? `,
      [account_type_cr_id, account_type_cr_id, account_user_id]
    );

    // const [latestStartRow] = await sql.query(`
    //     SELECT MAX(account_transition_start) AS latest_start
    //     FROM account_transition
    //     WHERE account_transition_submit IS NULL
    //       AND account_transition_start IS NOT NULL
    //   `);

    //   const latestStart = latestStartRow[0]?.latest_start;

    //   if (latestStart === null || latestStart === undefined) {
    //     return res.status(400).json({ error: "No unsubmitted transitions found." });
    // }

    // const query_sumvalueType = `
    //   SELECT
    //     account_type.account_type_name, 
    //     account_transition.account_type_id, 
    //     SUM(account_transition.account_transition_value) AS SUMGROUP_TYPE
    //   FROM
    //     account_type
    //   INNER JOIN
    //     account_transition ON account_type.account_type_id = account_transition.account_type_id

    //   GROUP BY account_type.account_type_id
    // `;
    // const [results] = await sql.query(query_sumvalueType);

    // // Get existing totals (exclude category_id = 3)
    // const get_account_type_total = `
    //   SELECT account_type_id, account_type_total
    //   FROM account_type
    //   WHERE account_category_id != 3
    // `;
    // const [account_type_total_all] = await sql.query(get_account_type_total);

    // const updatedAccountTypeIds = new Set();

    // const get_lasted_account_transition = ` สำคัญมากกก
    //   SELECT 
    //       account_transition.account_transition_id,
    //       account_transition.account_type_id,
    //       account_transition.account_transition_value 
    //   FROM
    //       account_user
    //       INNER JOIN account_group ON account_user.account_user_id = account_group.account_user_id
    //       INNER JOIN account_type ON account_group.account_group_id = account_type.account_group_id
    //       INNER JOIN account_transition ON account_type.account_type_id = account_transition.account_type_id
    //   WHERE
    //       account_user.account_user_id = ?
    //       AND account_group.account_category_id = 3
    //   ORDER BY
    //       account_transition.account_transition_id DESC
    //   LIMIT 1;
    // `;

    // const [lasted_account_transition] = await sql.query(
    //   get_lasted_account_transition,
    //   [account_user_id]
    // );

    // const { account_transition_value, account_type_id } = lasted_account_transition[0] || {};

    // await sql.query(
    //   `UPDATE account_type SET account_type_sum = account_type_sum + ?, account_type_total = account_type_total + ? WHERE account_type_id = ?`,
    //   [account_transition_value, account_transition_value, account_type_id]
    // ); ถึงนี่

    // for (const result of results) {
    //   const { SUMGROUP_TYPE, account_type_id } = result;

    //   // Avoid processing duplicate account_type_id
    //   if (updatedAccountTypeIds.has(account_type_id)) continue;
    //   updatedAccountTypeIds.add(account_type_id);

    //   const [categoryResult] = await sql.query(
    //     `SELECT account_category_id, account_type_total FROM account_type WHERE account_type_id = ?`,
    //     [account_type_id]
    //   );

    //   const [checkCategory] = await sql.query(
    //     `SELECT account_type_from_id, account_category_from_id
    //  FROM account_transition
    //  WHERE account_type_id = ?
    //  LIMIT 1`,
    //     [account_type_id]
    //   );

    //   const { account_category_id, account_type_total } =
    //     categoryResult[0] || {};
    //   const { account_type_from_id, account_category_from_id } =
    //     checkCategory[0] || {};

    //   const [isFromInOther] = await sql.query(
    //     `
    //     SELECT 1 FROM account_transition
    //     WHERE account_type_from_id = ? LIMIT 1
    //   `,
    //     [account_type_id]
    //   );

    //   const wasUsedAsSource = isFromInOther.length > 0;
    //   console.log(SUMGROUP_TYPE);

    //   if (account_category_id === 3) {
    //     console.log("IF: category_id === 3");
    //     await sql.query(
    //       `UPDATE account_type SET account_type_sum = ?, account_type_total = ? WHERE account_type_id = ?`,
    //       [SUMGROUP_TYPE, SUMGROUP_TYPE, account_type_id]
    //     );
    //   // } else if (!wasUsedAsSource && account_category_id !== 3) {
    //   //   // First-time insert
    //   //   await sql.query(
    //   //     `UPDATE account_type SET account_type_sum = ?, account_type_total = ? WHERE account_type_id = ?`,
    //   //     [SUMGROUP_TYPE, SUMGROUP_TYPE, account_type_id]
    //   //   );
    //   // } else {
    //   //   console.log("ELSE: copy total to sum");

    //   //   const matched = account_type_total_all.find(
    //   //     (item) => item.account_type_id === account_type_id
    //   //   );
    //   //   const totalToUse = matched ? matched.account_type_total : 0;

    //   //   await sql.query(
    //   //     `UPDATE account_type SET account_type_sum = ? WHERE account_type_id = ?`,
    //   //     [totalToUse, account_type_id]
    //   //   );
    //   // }
    // }
  // }

    await sql.query(
      `UPDATE account_type 
      JOIN account_group ON account_type.account_group_id = account_group.account_group_id
      JOIN account_user ON account_group.account_user_id = account_user.account_user_id
      SET account_type.account_type_sum = account_type.account_type_total 
      WHERE account_type.account_category_id != 3 AND account_user.account_user_id = ?`,
      [account_user_id]
    );


    res.status(200).json({
      message: "Account transition submitted and sums updated successfully.",
    });
  } catch (error) {
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  }
};