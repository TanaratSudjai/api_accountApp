const express = require("express");
const router = express.Router();
const dataDasktopController = require("../controllers/dataDasktop.controller");

/**
 * @swagger
 * /dasktop_data:
 *   get:
 *     tags:
 *       - Dasktop
 *     summary: Get Name Type Data
 *     description: Retrieve the list of name types from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of name types.
 */
router.get("/dasktop_data", dataDasktopController.getNameType);

/**
 * @swagger
 * /dasktop_data_sumtype:
 *   get:
 *     tags:
 *       - Dasktop
 *     summary: Get Sum Value by Type
 *     description: Retrieve the total value summarized by type from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the summarized values by type.
 */
router.get("/dasktop_data_sumtype", dataDasktopController.get_sumvalue_type);
/**
 * @swagger
 * /dasktop_data_sumzero:
 *   get:
 *     tags:
 *       - Dasktop
 *     summary: Get Sum Value by Type
 *     description: Retrieve the total value summarized by type from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the summarized values by type.
 */
router.get("/dasktop_data_sumzero", dataDasktopController.get_zero_value);




module.exports = router;
