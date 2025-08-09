const express = require("express");
const router = express.Router();
const bankControllers = require("../controllers/bankTransition.controller");

/**
 * @swagger
 * /bank_trantisionInsert:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Add a New Bank Transaction
 *     description: Add details of a new transaction to the bank system.
 *     responses:
 *       200:
 *         description: The bank transaction has been successfully added.
 */
router.post(
  "/bank_trantisionInsert",
  bankControllers.openAccountGroup_bankTransition
);

/**
 * @swagger
 * /bank_borrow:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Record a Loan Transaction
 *     description: Save a transaction for borrowing funds from the bank.
 *     responses:
 *       200:
 *         description: The loan transaction has been successfully recorded.
 */
router.post("/bank_borrow", bankControllers.creditor_borrow_bankTransition);

/**
 * @swagger
 * /bank_return:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Record a Return Transaction
 *     description: Save a transaction for returning funds to the bank.
 *     responses:
 *       200:
 *         description: The return transaction has been successfully recorded.
 */
router.post(
  "/bank_return",
  bankControllers.creditor_return_bankTransition
);

router.post(
  "/debtor_borrow",
  bankControllers.debtor_borrow_bankTransition
);
router.post(
  "/debtor_return",
  bankControllers.debtor_return_bankTransition
);
/**
 * @swagger
 * /reuse_return_bank/{account_transition_id}:
 *   delete:
 *     tags:
 *       - Transaction
 *     summary: Delete a Bank Transaction
 *     description: Remove a bank transaction using its unique ID.
 *     parameters:
 *       - name: account_transition_id
 *         in: path
 *         required: true
 *         description: The unique ID of the bank transaction to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The bank transaction has been successfully deleted.
 */
router.delete(
  "/reuse_return_bank/:account_transition_id",
  bankControllers.delFor_return_objectvalue
);
router.patch(
  "/return_transition_bank", bankControllers.delFor_return_bank
)
router.put("/return_creditor/:account_transition_id", bankControllers.delFor_Creditor);
router.put("/return_debtor/:account_transition_id", bankControllers.delFor_Debtor);


module.exports = router;
