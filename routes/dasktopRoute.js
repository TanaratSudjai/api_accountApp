const express = require("express");
const router = express.Router();
const dataDasktopController = require("../controllers/dataDasktopController");

/**
 * @swagger
 * /dasktop_data:
 *   get:
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
 *     summary: Get Sum Value by Type
 *     description: Retrieve the total value summarized by type from the desktop data.
 *     responses:
 *       200:
 *         description: Successfully retrieved the summarized values by type.
 */
router.get("/dasktop_data_sumzero", dataDasktopController.get_zero_value);




module.exports = router;
