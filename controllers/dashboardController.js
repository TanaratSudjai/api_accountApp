const sql = require("../database/db");

exports.getDashboard_forsubmition_transition = async (req, res) => {
  try {
    const query_transition_data = `
                                    SELECT
                                        *,
                                         account_type.account_type_total - account_type.account_type_sum AS account_type_difference
                                    FROM
                                        account_type
                                    WHERE 
                                        account_type.account_type_sum - account_type.account_type_total <> 0

                                    `;

    const [result] = await sql.query(query_transition_data);

    // ตรวจสอบว่าผลลัพธ์มีข้อมูลหรือไม่
    if (!result || result.length === 0) {
      return res.status(404).json({
        message: "No data found.",
      });
    }

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
