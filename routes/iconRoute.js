const express = require("express");
const router = express.Router();
const iconController = require("../controllers/iconController");

router.post("/insert_icons", iconController.insertIcons);

module.exports = router;