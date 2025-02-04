const multer = require("multer");
const path = require("path");

// ฟังก์ชันสำหรับสร้าง multer storage
const createMulterStorage = (folderName) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // กำหนดโฟลเดอร์สำหรับเก็บไฟล์
            cb(null, path.join(__dirname, `../public/${folderName}`));
        },
        filename: (req, file, cb) => {
            // ตั้งชื่อไฟล์ใหม่ (timestamp + นามสกุลไฟล์)
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });
};

// ฟังก์ชันสำหรับสร้าง multer instance
const createMulterUpload = (folderName) => {
    const storage = createMulterStorage(folderName);
    return multer({ storage });
};

module.exports = {
    createMulterStorage,
    createMulterUpload,
};