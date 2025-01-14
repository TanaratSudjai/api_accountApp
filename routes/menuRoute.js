const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.get("/menu_icon", menuController.getMenuWhereCat);
router.get("/menu_icon_FF", menuController.getMenuFF);

module.exports = router;
