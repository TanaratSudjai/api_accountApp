const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

/**
 * @swagger
 * /menu_icon:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get Menu Icons by Category
 *     description: Retrieve a list of menu icons filtered by category.
 *     responses:
 *       200:
 *         description: Successfully retrieved menu icons filtered by category.
 */
router.get("/menu_icon", menuController.getMenuWhereCat);

/**
 * @swagger
 * /menu_icon_FF:
 *   get:
 *     tags:
 *       - Menu
 *     summary: Get All Menu Icons
 *     description: Retrieve a complete list of menu icons.
 *     responses:
 *       200:
 *         description: Successfully retrieved all menu icons.
 */
router.get("/menu_icon_FF", menuController.getMenuFF);

module.exports = router;
