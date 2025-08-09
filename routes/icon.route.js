const express = require("express");
const router = express.Router();
const iconController = require("../controllers/icon.controller");

router.post("/insert_icons", iconController.insertIcons);
router.get("/get_icons/:categoryID", iconController.getIcons);

module.exports = router;