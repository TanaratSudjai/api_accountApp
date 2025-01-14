const express = require("express");
const router = express.Router();
const report = require("../controllers/reportController");

router.get("/report", report.reportAccount);

module.exports = router;
