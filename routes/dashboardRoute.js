const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Dashboard Data
 *     description: Retrieve submission transition data for the dashboard.
 *     responses:
 *       200:
 *         description: Successfully retrieved the dashboard data.
 */
router.get(
  "/dashboard",
  dashboardController.getDashboard_forsubmition_transition
);

module.exports = router;
