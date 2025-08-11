const sql = require("../database/db");
const jwt = require("jsonwebtoken");

exports.getDashboard_forsubmition_transition = async (req, res) => {
  
  try {
    const account_user_id = jwt.decode(req.cookies.token)?.account_user_id;
    const query_transition_data = `
                                    SELECT
                                          account_type.*,
                                          account_type.account_type_total - account_type.account_type_sum AS account_type_difference,
                                          MAX(account_transition.account_transition_datetime) AS last_transition_datetime,
                                          ANY_VALUE(account_transition.account_transition_id) AS transition_id 
                                      FROM
                                          account_type
                                          JOIN account_group ON account_type.account_group_id = account_group.account_group_id
                                          JOIN account_user ON account_group.account_user_id = account_user.account_user_id
                                          LEFT JOIN account_transition ON account_type.account_type_id = account_transition.account_type_id
                                      WHERE 
                                          account_type.account_type_sum - account_type.account_type_total <> 0
                                          AND account_user.account_user_id = ?
                                      GROUP BY
                                          account_type.account_type_id
                                      ORDER BY
                                          FIELD(account_type.account_category_id, 1, 6, 7, 4, 5, 2);
                                    `;

    const [result] = await sql.query(query_transition_data, [account_user_id]);

    // ตรวจสอบว่าผลลัพธ์มีข้อมูลหรือไม่
    // if (!result || result.length === 0) {
    //   return res.status(404).json({
    //     message: "No data found.",
    //   });
    // }

    // ส่งผลลัพธ์กลับไปยัง client
    res.status(200).json({
      result,
      message: "Fetch data transition successfully.",
    });
  } catch (error) {
    console.error("Unexpected error:", error); // บันทึกข้อผิดพลาด
    res.status(500).json({
      error: "Server error.",
      message: error.message || "Unknown error occurred.",
    });
  }
};
