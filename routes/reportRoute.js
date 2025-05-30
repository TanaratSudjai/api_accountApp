const express = require("express");
const router = express.Router();
const report = require("../controllers/reportController");

/**
 * @swagger
 * /report:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get Account Report
 *     description: Retrieve a detailed report of account activities.
 *     responses:
 *       200:
 *         description: Successfully retrieved the account report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Report details.
 *       500:
 *         description: Server error while fetching the report.
 */
router.get("/report", report.reportAccount);
router.get("/expense_chart", report.sumExpense);
router.get("/income_chart", report.sumIncome);
router.get("/daily_expense_totals", report.sumExpenseDaily);
router.get("/daily_income_totals", report.sumIncomeDaily);

module.exports = router;
