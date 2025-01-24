const express = require("express");
const router = express.Router();
const bankControllers = require("../controllers/bankTransitionController");



/**
 * @swagger
 * /bank_trantisionInsert:
 *   post:
 *     summary: Insert Bank Transaction
 *     description: Add a new bank transaction to the system.
 *     responses:
 *       200:
 *         description: Bank transaction added successfully.
 */
router.post(
  "/bank_trantisionInsert",
  bankControllers.openAccountGroup_bankTransition
);

/**
 * @swagger
 * /bank_borrow:
 *   post:
 *     summary: Borrow from Bank
 *     description: Record a borrowing transaction from the bank.
 *     responses:
 *       200:
 *         description: Borrowing transaction recorded successfully.
 */
router.post("/bank_borrow", bankControllers.creditor_borrow_bankTransition);

/**
 * @swagger
 * /bank_return:
 *   post:
 *     summary: Return to Bank
 *     description: Record a return transaction to the bank.
 *     responses:
 *       200:
 *         description: Return transaction recorded successfully.
 */
router.post("/bank_return", bankControllers.creditor_return_bankTransition);

/**
 * @swagger
 * /reuse_return_bank/{account_transition_id}:
 *   delete:
 *     summary: Delete Bank Transaction
 *     description: Remove a specific bank transaction using its ID.
 *     parameters:
 *       - name: account_transition_id
 *         in: path
 *         required: true
 *         description: ID of the bank transaction to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bank transaction deleted successfully.
 */
router.delete(
  "/reuse_return_bank/:account_transition_id",
  bankControllers.delFor_return_objectvalue
);

module.exports = router;
