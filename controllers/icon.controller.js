const { createMulterUpload } = require("../utils/multerConfig");
const sql = require("../database/db");
const redisServer = require("../database/redis")

// สร้าง multer instance สำหรับโฟลเดอร์ icons
const upload = createMulterUpload("icons");

exports.insertIcons = async (req, res) => {
    try {
        // อัปโหลดไฟล์
        upload.single("icons")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: "File upload failed" });
            }
            const account_icon_name = req.file.filename;
            const query = "INSERT INTO account_icon (account_icon_name) VALUES (?)";
            await sql.query(query, [account_icon_name]);
            res.status(200).json({ message: "File uploaded successfully", account_icon_name });
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getIcons = async (req, res) => {

    try {
        const categoryID = req.params.categoryID;
        const cacheKey = `icons_category:${categoryID}`;

        // เช็ค cache ก่อน
        const cachedData = await redisServer.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                data: JSON.parse(cachedData),
                source: "redis",
            });
        }

        const [icons] = await sql.query(
            "SELECT * FROM account_icon WHERE account_icon_category = ?",
            [categoryID]
        );

        // เก็บ cache 5 นาที
        await redisServer.set(cacheKey, JSON.stringify(icons), "EX", 300);

        res.status(200).json({
            data: icons,
            source: "mysql",
        });
        
    } catch (err) {
        console.error("Error fetching icons:", err);

        res.status(500).json({
            message: "An error occurred while fetching the icons.",
            error: err.message,
        });
    }
};
