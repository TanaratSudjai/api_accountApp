const express = require("express");
const router = express.Router();
const dataDesktopController = require("../controllers/dataDasktop.controller");

/**
 * @swagger
 * /desktop_data:
 *   get:
 *     tags:
 *       - Desktop
 *     summary: Get Name Type Data
 *     description: Retrieve the list of name types from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of name types.
 */
router.get("/desktop_data", dataDesktopController.getNameType);

/**
 * @swagger
 * /desktop_data_sumtype:
 *   get:
 *     tags:
 *       - Desktop
 *     summary: Get Sum Value by Type
 *     description: Retrieve the total value summarized by type from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the summarized values by type.
 */
router.get("/desktop_data_sumtype", dataDesktopController.get_sumvalue_type);

/**
 * @swagger
 * /desktop_data_sumzero:
 *   get:
 *     tags:
 *       - Desktop
 *     summary: Get Sum Value by Type
 *     description: Retrieve the total value summarized by type from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the summarized values by type.
 */
router.get("/desktop_data_sumzero", dataDesktopController.get_zero_value);

module.exports = router;