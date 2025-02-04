const { createMulterUpload } = require("../utils/multerConfig");
const sql = require("../database/db");

// สร้าง multer instance สำหรับโฟลเดอร์ icons
const upload = createMulterUpload("icons");

exports.insertIcons = async (req, res) => {
    try {
        // อัปโหลดไฟล์
        upload.single("icons")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: "File upload failed" });
            }

            // ดึงชื่อไฟล์ที่อัปโหลด
            const account_icon_name = req.file.filename;

            // บันทึกชื่อไฟล์ลงในฐานข้อมูล
            const query = "INSERT INTO account_icon (account_icon_name) VALUES (?)";
            await sql.query(query, [account_icon_name]);

            // ส่ง response กลับไป
            res.status(200).json({ message: "File uploaded successfully", account_icon_name });
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};