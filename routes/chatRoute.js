const express = require("express");
const router = express.Router();
const pieChartController = require("../controllers/pieChartController");
/**
 * @swagger
 * /dataGetIncome:
 *   get:
 *     summary: Get Dashboard Data
 *     description: Retrieve submission transition data for the dashboard.
 *     responses:
 *       200:
 *         description: Successfully retrieved the dashboard data.
 */
router.get("/dataGetIncome", pieChartController.getIncome);
/**
 * @swagger
 * /dataGetExpanse:
 *   get:
 *     summary: Get Dashboard Data
 *     description: Retrieve submission transition data for the dashboard.
 *     responses:
 *       200:
 *         description: Successfully retrieved the dashboard data.
 */
router.get("/dataGetExpanse", pieChartController.getExpanse);

module.exports = router;
