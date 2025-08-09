const sql = require("../database/db");

exports.openAccountGroup_bankTransition = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const {
      account_type_id,
      account_type_from_id,
      account_category_id,
      account_transition_start,
      account_transition_value: initialTransitionValue, // ใช้ตัวแปรที่แตกต่าง
    } = req.body;

    // คำสั่ง SQL เพื่อดึง account_type_sum
    const readValueQuery = `SELECT account_type_total FROM account_type WHERE account_type_id = ?`;
    const [readValueResult] = await connection.query(readValueQuery, [
      account_type_id,
    ]);

    // ตรวจสอบว่าได้ค่า account_type_sum หรือไม่
    if (readValueResult.length === 0) {
      return res.status(404).json({ error: "Account type not found." });
    }

    const value_type = readValueResult[0].account_type_total;
    //console.log("ใส่เเทนยอดเกิน " + value_type);

    // กำหนดค่า account_transition_value
    let account_transition_value = initialTransitionValue; // ใช้ let แทน const

    // ถ้า account_transition_value มากกว่า account_type_sum
    if (account_transition_value > value_type) {
      account_transition_value = value_type; // ตั้งค่า account_transition_value เป็น account_type_sum
    }

    const maxQuery = `
        SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
        FROM account_transition
        WHERE account_transition_submit = 1
      `;

    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    //  กรอง id ของ type เเละ from type id เพื่อ หา ต้น-ปลายทาง เเละ value ที่ทำรายการไป
    const account_transition_value_transition = account_transition_value; //ยอดทำรายการ
    const params_type_id_start = account_type_id; // id ของต้นทาง
    const params_type_id_end = account_type_from_id; // id ของปลายทาง
    console.log("start " + params_type_id_start);
    console.log("end " + params_type_id_end);
    console.log("values " + account_transition_value_transition);

    // นำค่ามากรองเอา value ไป บวก ที่ปลายทาง เเละ หัก ลบต้นทาง

    // ตัดยอดของ ต้นทาง
    const query_value_process_strat_transition = `
                                                  UPDATE account_type 
                                                  SET account_type_total = account_type_total - ? 
                                                  WHERE account_type_id = ? AND account_type_total >= ?
                                                  `;
    await connection.query(query_value_process_strat_transition, [
      account_transition_value_transition,
      params_type_id_start,
      account_transition_value_transition,
    ]);

    // เติมยอดของ ปลายทาง
    const query_value_process_end_transition = `UPDATE account_type 
                                                SET account_type_total = account_type_total + ? 
                                                WHERE account_type_id = ?
                                                `;
    await connection.query(query_value_process_end_transition, [
      account_transition_value_transition,
      params_type_id_end,
    ]);

    const query = `
        INSERT INTO account_transition 
        (account_type_id, account_category_id, account_transition_value, account_transition_datetime, account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id)
        VALUES (?, ?, ?, NOW(), ?, ?, 1,?,?) `;
    //ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
    await connection.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_id,
      account_type_from_id,
      account_transition_value,
    ]);
    await connection.commit();
    console.log("value is :", params_type_id_end);

    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error.message);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};

// success
exports.creditor_borrow_bankTransition = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const {
      account_type_id,
      account_type_from_id,
      account_category_id,
      account_transition_start,
      account_transition_value: initialTransitionValue, // ใช้ตัวแปรที่แตกต่าง
    } = req.body;

    // คำสั่ง SQL เพื่อดึง account_type_sum
    const readValueQuery = `SELECT account_type_total FROM account_type WHERE account_type_id = ?`;
    const [readValueResult] = await connection.query(readValueQuery, [
      account_type_id,
    ]);

    // ตรวจสอบว่าได้ค่า account_type_sum หรือไม่
    if (readValueResult.length === 0) {
      return res.status(404).json({ error: "Account type not found." });
    }

    const value_type = readValueResult[0].account_type_total;
    //console.log("ใส่เเทนยอดเกิน " + value_type);

    // กำหนดค่า account_transition_value
    let account_transition_value = initialTransitionValue; // ใช้ let แทน const

    // ถ้า account_transition_value มากกว่า account_type_sum
    // if (account_transition_value > value_type) {
    //   account_transition_value = value_type; // ตั้งค่า account_transition_value เป็น account_type_sum
    // }

    const maxQuery = `
        SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
        FROM account_transition
        WHERE account_transition_submit = 1
      `;

    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    //  กรอง id ของ type เเละ from type id เพื่อ หา ต้น-ปลายทาง เเละ value ที่ทำรายการไป
    const account_transition_value_transition = account_transition_value; //ยอดทำรายการ
    const params_type_id_start = account_type_id; // id ของต้นทาง
    const params_type_id_end = account_type_from_id; // id ของปลายทาง
    console.log("start " + params_type_id_start);
    console.log("end " + params_type_id_end);
    console.log("values " + account_transition_value_transition);

    // นำค่ามากรองเอา value ไป บวก ที่ปลายทาง เเละ หัก ลบต้นทาง

    // ตัดยอดของ ต้นทาง
    const query_value_process_strat_transition = `
                                                  UPDATE account_type 
                                                  SET account_type_total = account_type_total + ? 
                                                  WHERE account_type_id = ? 
                                                  `;
    await connection.query(query_value_process_strat_transition, [
      account_transition_value_transition,
      params_type_id_start,
      account_transition_value_transition,
    ]);

    // เติมยอดของ ปลายทาง
    const query_value_process_end_transition = `UPDATE account_type 
                                                SET account_type_total = account_type_total + ? 
                                                WHERE account_type_id = ?
                                                `;
    await connection.query(query_value_process_end_transition, [
      account_transition_value,
      params_type_id_end,
    ]);

    const query = `
        INSERT INTO account_transition 
        (account_type_id, account_category_id, account_transition_value, account_transition_datetime, account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id)
        VALUES (?, ?, ?, NOW(), ?, ?, 1,?,?) 
        ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
      `;

    await connection.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_id,
      account_type_from_id,
      account_transition_value,
    ]);
    await connection.commit();
    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};
// success
exports.creditor_return_bankTransition = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const {
      account_type_id,
      account_type_from_id,
      account_category_id,
      account_transition_start,
      account_transition_value: initialTransitionValue, // ใช้ตัวแปรที่แตกต่าง
    } = req.body;

    // คำสั่ง SQL เพื่อดึง account_type_sum
    const readValueQuery = `SELECT account_type_total FROM account_type WHERE account_type_id = ?`;
    const [readValueResult] = await connection.query(readValueQuery, [
      account_type_id,
    ]);

    // ตรวจสอบว่าได้ค่า account_type_sum หรือไม่
    if (readValueResult.length === 0) {
      return res.status(404).json({ error: "Account type not found." });
    }

    const value_type = readValueResult[0].account_type_total;
    //console.log("ใส่เเทนยอดเกิน " + value_type);

    // กำหนดค่า account_transition_value
    let account_transition_value = initialTransitionValue; // ใช้ let แทน const

    // ถ้า account_transition_value มากกว่า account_type_sum
    // if (account_transition_value > value_type) {
    //   account_transition_value = value_type; // ตั้งค่า account_transition_value เป็น account_type_sum
    // }

    const maxQuery = `
        SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
        FROM account_transition
        WHERE account_transition_submit = 1
      `;

    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    //  กรอง id ของ type เเละ from type id เพื่อ หา ต้น-ปลายทาง เเละ value ที่ทำรายการไป
    const account_transition_value_transition = account_transition_value; //ยอดทำรายการ
    const params_type_id_start = account_type_id; // id ของต้นทาง
    const params_type_id_end = account_type_from_id; // id ของปลายทาง
    console.log("start " + params_type_id_start);
    console.log("end " + params_type_id_end);
    console.log("values " + account_transition_value_transition);

    // นำค่ามากรองเอา value ไป บวก ที่ปลายทาง เเละ หัก ลบต้นทาง

    // ตัดยอดของ ต้นทาง
    const query_value_process_strat_transition = `
                                                  UPDATE account_type 
                                                  SET account_type_total = account_type_total - ? 
                                                  WHERE account_type_id = ? 
                                                  `;
    await connection.query(query_value_process_strat_transition, [
      account_transition_value_transition,
      params_type_id_start,
      account_transition_value_transition,
    ]);

    // เติมยอดของ ปลายทาง
    const query_value_process_end_transition = `UPDATE account_type 
                                                SET account_type_total = account_type_total - ? 
                                                WHERE account_type_id = ?
                                                `;
    await connection.query(query_value_process_end_transition, [
      account_transition_value,
      params_type_id_end,
    ]);

    const query = `
        INSERT INTO account_transition 
        (account_type_id, account_category_id, account_transition_value, account_transition_datetime, account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id)
        VALUES (?, ?, ?, NOW(), ?, ?, 2,?,?) 
        ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
      `;

    await connection.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_id,
      account_type_from_id,
      account_transition_value,
    ]);
    await connection.commit();
    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};

exports.debtor_borrow_bankTransition = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const {
      account_type_id,
      account_type_from_id,
      account_category_id,
      account_transition_start,
      account_transition_value: initialTransitionValue, // ใช้ตัวแปรที่แตกต่าง
    } = req.body;

    // คำสั่ง SQL เพื่อดึง account_type_sum
    const readValueQuery = `SELECT account_type_total FROM account_type WHERE account_type_id = ?`;
    const [readValueResult] = await connection.query(readValueQuery, [
      account_type_id,
    ]);

    // ตรวจสอบว่าได้ค่า account_type_sum หรือไม่
    if (readValueResult.length === 0) {
      return res.status(404).json({ error: "Account type not found." });
    }

    const value_type = readValueResult[0].account_type_total;
    //console.log("ใส่เเทนยอดเกิน " + value_type);

    // กำหนดค่า account_transition_value
    let account_transition_value = parseFloat(initialTransitionValue); // ใช้ let แทน const

    // ถ้า account_transition_value มากกว่า account_type_sum
    // if (account_transition_value > value_type) {
    //   account_transition_value = value_type; // ตั้งค่า account_transition_value เป็น account_type_sum
    // }

    const maxQuery = `
        SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
        FROM account_transition
        WHERE account_transition_submit = 1
      `;

    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    //  กรอง id ของ type เเละ from type id เพื่อ หา ต้น-ปลายทาง เเละ value ที่ทำรายการไป
    const account_transition_value_transition = account_transition_value; //ยอดทำรายการ
    const params_type_id_start = account_type_id; // id ของต้นทาง
    const params_type_id_end = account_type_from_id; // id ของปลายทาง
    console.log("start " + params_type_id_start);
    console.log("end " + params_type_id_end);
    console.log("values " + account_transition_value_transition);

    // นำค่ามากรองเอา value ไป บวก ที่ปลายทาง เเละ หัก ลบต้นทาง

    // ตัดยอดของ ต้นทาง
    const query_value_process_strat_transition = `
                                                  UPDATE account_type 
                                                  SET account_type_total = account_type_total - ? 
                                                  WHERE account_type_id = ? 
                                                  `;
    await connection.query(query_value_process_strat_transition, [
      account_transition_value_transition,
      params_type_id_start,
      account_transition_value_transition,
    ]);

    // เติมยอดของ ปลายทาง
    const query_value_process_end_transition = `UPDATE account_type 
                                                SET account_type_total = account_type_total + ? 
                                                WHERE account_type_id = ?
                                                `;
    await connection.query(query_value_process_end_transition, [
      account_transition_value,
      params_type_id_end,
    ]);

    const query = `
        INSERT INTO account_transition 
        (account_type_id, account_category_id, account_transition_value, account_transition_datetime, account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id)
        VALUES (?, ?, ?, NOW(), ?, ?, 6,?,?) 
        ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
      `;

    await connection.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_id,
      account_type_from_id,
      account_transition_value,
    ]);
    await connection.commit();
    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};

exports.debtor_return_bankTransition = async (req, res) => {
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const {
      account_type_id,
      account_type_from_id,
      account_category_id,
      account_transition_start,
      account_transition_value: initialTransitionValue, // ใช้ตัวแปรที่แตกต่าง
    } = req.body;

    // คำสั่ง SQL เพื่อดึง account_type_sum
    const readValueQuery = `SELECT account_type_total FROM account_type WHERE account_type_id = ?`;
    const [readValueResult] = await connection.query(readValueQuery, [
      account_type_id,
    ]);

    // ตรวจสอบว่าได้ค่า account_type_sum หรือไม่
    if (readValueResult.length === 0) {
      return res.status(404).json({ error: "Account type not found." });
    }

    const value_type = readValueResult[0].account_type_total;
    //console.log("ใส่เเทนยอดเกิน " + value_type);

    // กำหนดค่า account_transition_value
    let account_transition_value = initialTransitionValue; // ใช้ let แทน const

    // ถ้า account_transition_value มากกว่า account_type_sum
    // if (account_transition_value > value_type) {
    //   account_transition_value = value_type; // ตั้งค่า account_transition_value เป็น account_type_sum
    // }

    const maxQuery = `
        SELECT COALESCE(MAX(account_transition_start), 0) + 1 AS max_start
        FROM account_transition
        WHERE account_transition_submit = 1
      `;

    const [maxResult] = await connection.query(maxQuery);
    const newStartValue = maxResult[0].max_start || account_transition_start;

    //  กรอง id ของ type เเละ from type id เพื่อ หา ต้น-ปลายทาง เเละ value ที่ทำรายการไป
    const account_transition_value_transition = account_transition_value; //ยอดทำรายการ
    const params_type_id_start = account_type_id; // id ของต้นทาง
    const params_type_id_end = account_type_from_id; // id ของปลายทาง
    console.log("start " + params_type_id_start);
    console.log("end " + params_type_id_end);
    console.log("values " + account_transition_value_transition);

    // นำค่ามากรองเอา value ไป บวก ที่ปลายทาง เเละ หัก ลบต้นทาง

    // ตัดยอดของ ต้นทาง
    const query_value_process_strat_transition = `
                                                  UPDATE account_type 
                                                  SET account_type_total = account_type_total - ? 
                                                  WHERE account_type_id = ? 
                                                  `;
    await connection.query(query_value_process_strat_transition, [
      account_transition_value_transition,
      params_type_id_start,
      account_transition_value_transition,
    ]);

    // เติมยอดของ ปลายทาง
    const query_value_process_end_transition = `UPDATE account_type 
                                                SET account_type_total = account_type_total + ? 
                                                WHERE account_type_id = ?
                                                `;
    await connection.query(query_value_process_end_transition, [
      account_transition_value,
      params_type_id_end,
    ]);

    const query = `
        INSERT INTO account_transition 
        (account_type_id, account_category_id, account_transition_value, account_transition_datetime, account_type_from_id, account_transition_start, account_category_from_id, account_type_cr_id, account_type_dr_id)
        VALUES (?, ?, ?, NOW(), ?, ?, 1,?,?) 
        ON DUPLICATE KEY UPDATE account_transition_value = ?, account_transition_datetime = NOW()
      `;

    await connection.query(query, [
      account_type_id,
      account_category_id,
      account_transition_value,
      account_type_from_id,
      newStartValue,
      account_type_id,
      account_type_from_id,
      account_transition_value,
    ]);
    await connection.commit();
    res
      .status(200)
      .json({ message: "Account transition inserted/updated successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting account transition:", error);
    res.status(500).json({ error: "Error inserting account transition." });
  } finally {
    connection.release();
  }
};

// bank debtor
exports.delTransition_bank_objectvalue = async (req, res) => {
  const { account_transition_id } = req.params;
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();

    // Get transition details
    const get_value_transition = `
      SELECT 
        account_transition_value, 
        account_type_id AS transition_start,
        account_type_from_id AS transition_end 
      FROM account_transition 
      WHERE account_transition_id = ?`;
    const [result] = await connection.query(get_value_transition, [
      account_transition_id,
    ]);

    if (result.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Transition not found." });
    }

    const value_reuse = result[0].account_transition_value;
    const transition_start_id = result[0].transition_start;
    const transition_end_id = result[0].transition_end;

    // Refund to start
    await connection.query(
      `UPDATE account_type SET account_type_total = account_type_total + ? WHERE account_type_id = ?`,
      [value_reuse, transition_start_id]
    );
    // Deduct from end
    await connection.query(
      `UPDATE account_type SET account_type_total = account_type_total - ? WHERE account_type_id = ?`,
      [value_reuse, transition_end_id]
    );

    // Delete transition
    const [deleteResult] = await connection.query(
      `DELETE FROM account_transition WHERE account_transition_id = ?`,
      [account_transition_id]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Delete failed, transition not found." });
    }

    await connection.commit();
    res.status(200).json({ message: "Transition deleted successfully." });
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting transition bank:", err);
    res.status(500).json({
      error: err.message,
      warning: "Error deleting transition bank!",
    });
  } finally {
    connection.release();
  }
};

// เจ้าหนี้ ลบ  แก้
exports.delFor_return_objectvalue = async (req, res) => {
  const { account_transition_id } = req.params;
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const serch_category_id_with_transition_id = `SELECT
                                                  account_category.account_category_id,
                                                  account_transition.account_transition_id,
                                                  account_transition.account_transition_value,
                                                  account_type.account_category_id as type_category_id
                                              FROM
                                                  account_category
                                                  INNER JOIN account_type ON account_category.account_category_id = account_type.account_category_id
                                                  INNER JOIN account_transition ON account_transition.account_type_id = account_type.account_type_id
                                              WHERE
                                                account_transition.account_transition_id = ? ;
                                              `;
    const [category_id_borrow] = await connection.query(
      serch_category_id_with_transition_id,
      [account_transition_id]
    );

    const [result] = await connection.query(
      `SELECT 
                                        account_transition_value , 
                                        account_type_id AS transition_start ,
                                        account_type_from_id AS transition_end 
                                      FROM account_transition 
                                      WHERE account_transition_id = ? `,
      [account_transition_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Transition not found." });
    }

    //นำค่ากรองมาเก็บในตัวแปร จะได้ง่ายในการเอาไปใช้
    const value_reuse = result[0].account_transition_value; // ค่าที่จะคืนกลับไปให้ต้นทาง
    const transition_start_id = result[0].transition_start; // id transition ของต้นทาง
    const transition_end_id = result[0].transition_end; // id transition ของปลายทาง

    console.log(value_reuse, transition_start_id, transition_end_id);

    // กรอง id category
    const type_category_id = category_id_borrow[0].type_category_id;

    // switch เช็ค ว่า ยืม หรือ คืน
    var transition_query, reuse_value_query;
    console.log(type_category_id);

    switch (type_category_id) {
      case 1:
        transition_query = `UPDATE account_type 
                            SET account_type_total = account_type_total + ? 
                            WHERE account_type_id = ?;
                            `;
        reuse_value_query = `UPDATE account_type SET account_type_total = account_type_total + ? WHERE account_type_id = ?`;
      case 2:
        transition_query = `UPDATE account_type 
                            SET account_type_total = account_type_total - ? 
                            WHERE account_type_id = ?;
                            `;
        reuse_value_query = `UPDATE account_type SET account_type_total = account_type_total - ? WHERE account_type_id = ?`;
    }

    await connection.query(transition_query, [value_reuse, transition_end_id]);
    await connection.query(reuse_value_query, [value_reuse, transition_start_id]);

    const delete_transition = `DELETE FROM account_transition WHERE account_transition_id = ? `;
    await connection.query(delete_transition, [account_transition_id]);
    await connection.commit();
    res.status(200).json({ message: "Transition deleted successfully." });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({
      error: err.message,
      warning: "Error deleting transition bank!",
    });
  } finally {
    connection.release();
  }
};

//return back transition
exports.delFor_return_bank = async (req, res) => {
  // const { account_transition_id } = req.params;
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const select_transition_latest = `SELECT *
                                    FROM account_transition
                                    WHERE account_category_id = 7 AND account_category_from_id = 1
                                    ORDER BY account_transition_id DESC
                                    LIMIT 1;
                                    ;
                                                `;
    // transition_latest data
    const [result_select_transition_latest] = await connection.query(
      select_transition_latest
    );

    if (!result_select_transition_latest[0]) {
      console.log("transition not found");
    }
    console.log(result_select_transition_latest[0].account_type_id);

    // account_type_id
    const rollback_id = result_select_transition_latest[0].account_type_id; //101 bualuang
    const rollback_value =
      result_select_transition_latest[0].account_transition_value;

    const id_for_check_value =
      result_select_transition_latest[0].account_type_from_id;

    const check_value = `SELECT account_type_total FROM account_type WHERE account_type_id = ?`; // 25

    const [result_check_value] = await connection.query(check_value, [
      id_for_check_value,
    ]);

    const account_type_total = result_check_value[0]?.account_type_total;

    if (Number(account_type_total) < Number(rollback_value)) {
      return res.status(400).json({
        message: "Cannot rollback, value is less than the transition value.",
      });
    }

    const rollback_transition =
      "UPDATE account_type SET account_type_total = account_type_total + ? WHERE account_type_id = ?";
    await connection.query(rollback_transition, [rollback_value, rollback_id]);

    // account_type_from_id
    const rollback_id_from =
      result_select_transition_latest[0].account_type_from_id; // 150 true_money

    const rollback_transition_from =
      "UPDATE account_type SET account_type_total = account_type_total - ? WHERE account_type_id = ?";

    await connection.query(rollback_transition_from, [rollback_value, rollback_id_from]);

    const account_transition_id =
      result_select_transition_latest[0].account_transition_id;
    await connection.query(
      "DELETE FROM account_transition WHERE account_transition_id = ?",
      [account_transition_id]
    );
    await connection.commit();
    res.json({
      data: result_select_transition_latest[0],
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

exports.delFor_Creditor = async (req, res) => {
  const { account_transition_id } = req.params;
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const check_cat_and_cat_from_id = `
    SELECT *
    FROM account_transition
    WHERE account_transition_id = ?;
    `;
    const [rows] = await connection.query(check_cat_and_cat_from_id, [
      account_transition_id,
    ]);

    const result = rows[0];

    if (!result) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    if (
      result.account_category_id === 2 &&
      result.account_category_from_id === 1
    ) {
      //การยิมจากเจ้าหนี้
      const return_value_of_creditor = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total - ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_creditor, [
        parseFloat(result.account_transition_value),
        result.account_type_cr_id,
      ]);

      const return_value_of_owner = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total - ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_owner, [
        parseFloat(result.account_transition_value),
        result.account_type_dr_id,
      ]);

      const delete_transition = `
      DELETE FROM account_transition WHERE account_transition_id = ?;
      `;
      await connection.query(delete_transition, [account_transition_id]);
    }
    if (
      result.account_category_id === 1 &&
      result.account_category_from_id === 2
    ) {
      //การคืนจากเจ้าหนี้
      const return_value_of_creditor = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total + ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_creditor, [
        parseFloat(result.account_transition_value),
        result.account_type_cr_id,
      ]);

      const return_value_of_owner = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total + ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_owner, [
        parseFloat(result.account_transition_value),
        result.account_type_dr_id,
      ]);

      const delete_transition = `
      DELETE FROM account_transition WHERE account_transition_id = ?;
      `;
      await connection.query(delete_transition, [account_transition_id]);
    }
    await connection.commit();
    res
      .status(200)
      .json({ message: "Account transition deleted successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting account transition:", error);
    res.status(500).json({ error: "Error deleting account transition." });
  } finally {
    connection.release();
  }
};

exports.delFor_Debtor = async (req, res) => {
  const { account_transition_id } = req.params;
  const connection = await sql.getConnection();
  try {
    await connection.beginTransaction();
    const check_cat_and_cat_from_id = `
    SELECT *
    FROM account_transition
    WHERE account_transition_id = ?;
    `;
    const [rows] = await connection.query(check_cat_and_cat_from_id, [
      account_transition_id,
    ]);

    const result = rows[0];

    if (!result) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    if (
      result.account_category_id === 1 &&
      result.account_category_from_id === 6
    ) {
      //การยิมจากเจ้าหนี้
      const return_value_of_creditor = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total + ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_creditor, [
        parseFloat(result.account_transition_value),
        result.account_type_cr_id,
      ]);

      const return_value_of_owner = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total - ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_owner, [
        parseFloat(result.account_transition_value),
        result.account_type_dr_id,
      ]);

      const delete_transition = `
      DELETE FROM account_transition WHERE account_transition_id = ?;
      `;
      await connection.query(delete_transition, [account_transition_id]);
    }
    if (
      result.account_category_id === 6 &&
      result.account_category_from_id === 1
    ) {
      //การคืนจากเจ้าหนี้
      const return_value_of_creditor = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total + ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_creditor, [
        parseFloat(result.account_transition_value),
        result.account_type_cr_id,
      ]);

      const return_value_of_owner = `
      UPDATE account_type SET account_type.account_type_total = account_type.account_type_total - ? WHERE account_type.account_type_id = ?;
      `;
      await connection.query(return_value_of_owner, [
        parseFloat(result.account_transition_value),
        result.account_type_dr_id,
      ]);

      const delete_transition = `
      DELETE FROM account_transition WHERE account_transition_id = ?;
      `;
      await connection.query(delete_transition, [account_transition_id]);
    }
    await connection.commit();
    res
      .status(200)
      .json({ message: "Account transition deleted successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting account transition:", error);
    res.status(500).json({ error: "Error deleting account transition." });
  } finally {
    connection.release();
  }
};