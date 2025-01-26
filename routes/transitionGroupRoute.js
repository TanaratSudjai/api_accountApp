const express = require("express");
const router = express.Router();
const transitionGroupController = require("../controllers/transitionGroupController");

/**
 * @swagger
 * /getMenuGroup_expense:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Expense Menu Groups
 *     description: Retrieve all expense menu groups.
 *     responses:
 *       200:
 *         description: Successfully retrieved expense menu groups.
 */
router.get(
  "/getMenuGroup_expense",
  transitionGroupController.getMenuGroup_expense
);

/**
 * @swagger
 * /getMenuGroup_income:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Income Menu Groups
 *     description: Retrieve all income menu groups.
 *     responses:
 *       200:
 *         description: Successfully retrieved income menu groups.
 */
router.get(
  "/getMenuGroup_income",
  transitionGroupController.getMenuGroup_income
);

/**
 * @swagger
 * /getSelect_countSelect:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Selection Count
 *     description: Retrieve the count of selected transitions.
 *     responses:
 *       200:
 *         description: Successfully retrieved the count.
 */
router.get(
  "/getSelect_countSelect",
  transitionGroupController.getCountSelectTransition
);

/**
 * @swagger
 * /getSelect_select/{account_type_id}:
 *   put:
 *     tags:
 *       - Transition Group
 *     summary: Update Selection by Account Type ID
 *     description: Update selection value for a specific account type ID.
 *     parameters:
 *       - name: account_type_id
 *         in: path
 *         required: true
 *         description: ID of the account type to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully updated the selection value.
 */
router.put(
  "/getSelect_select/:account_type_id",
  transitionGroupController.UpdateValue
);

/**
 * @swagger
 * /transition_group_income_and_extend:
 *   post:
 *     tags:
 *       - Transition Group
 *     summary: Submit Income and Expense Group Transition
 *     description: Submit transitions for both income and expense groups.
 *     responses:
 *       200:
 *         description: Successfully submitted the transition.
 */
router.post(
  "/transition_group_income_and_extend",
  transitionGroupController.submit_transition_group_income_extend
);

/**
 * @swagger
 * /transition_select_expense:
 *   post:
 *     tags:
 *       - Transition Group
 *     summary: Open Expense Group Transition
 *     description: Create a new transition for the expense group.
 *     responses:
 *       200:
 *         description: Successfully created the expense transition.
 */
router.post(
  "/transition_select_expense",
  transitionGroupController.openAccountGroup_expense
);

/**
 * @swagger
 * /transition_select_income:
 *   post:
 *     tags:
 *       - Transition Group
 *     summary: Open Income Group Transition
 *     description: Create a new transition for the income group.
 *     responses:
 *       200:
 *         description: Successfully created the income transition.
 */
router.post(
  "/transition_select_income",
  transitionGroupController.openAccountGroup_income
);

/**
 * @swagger
 * /get_type_from_id:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Account Type from ID
 *     description: Retrieve account type details using its ID.
 *     responses:
 *       200:
 *         description: Successfully retrieved account type details.
 */
router.get("/get_type_from_id", transitionGroupController.getType_from_id);

/**
 * @swagger
 * /get_creditor:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Creditors
 *     description: Retrieve a list of creditors.
 *     responses:
 *       200:
 *         description: Successfully retrieved creditors.
 */
router.get("/get_creditor", transitionGroupController.getCreditor);

/**
 * @swagger
 * /get_debtor:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Debtors
 *     description: Retrieve a list of debtors.
 *     responses:
 *       200:
 *         description: Successfully retrieved debtors.
 */
router.get("/get_debtor", transitionGroupController.getDebtor);

/**
 * @swagger
 * /get_expense_transition:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Expense Transitions
 *     description: Retrieve all expense transitions.
 *     responses:
 *       200:
 *         description: Successfully retrieved expense transitions.
 */
router.get(
  "/get_expense_transition",
  transitionGroupController.get_expense_transition
);

/**
 * @swagger
 * /get_income_transition:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Income Transitions
 *     description: Retrieve all income transitions.
 *     responses:
 *       200:
 *         description: Successfully retrieved income transitions.
 */
router.get(
  "/get_income_transition",
  transitionGroupController.get_income_transition
);

/**
 * @swagger
 * /deletetransition/{account_transition_id}:
 *   delete:
 *     tags:
 *       - Transition Group
 *     summary: Delete Transition
 *     description: Delete a transition using its ID.
 *     parameters:
 *       - name: account_transition_id
 *         in: path
 *         required: true
 *         description: ID of the transition to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the transition.
 */
router.delete(
  "/deletetransition/:account_transition_id",
  transitionGroupController.deleteTransition
);

/**
 * @swagger
 * /delete_transition_expense/{account_transition_id}:
 *   put:
 *     tags:
 *       - Transition Group
 *     summary: Mark Expense Transition as Deleted
 *     description: Mark a specific expense transition as deleted using its ID.
 *     parameters:
 *       - name: account_transition_id
 *         in: path
 *         required: true
 *         description: ID of the expense transition to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully marked the expense transition as deleted.
 */
router.put(
  "/delete_transition_expense/:account_transition_id",
  transitionGroupController.delete_transition_expense
);

/**
 * @swagger
 * /delete_transition_income/{account_transition_id}:
 *   put:
 *     tags:
 *       - Transition Group
 *     summary: Mark Income Transition as Deleted
 *     description: Mark a specific income transition as deleted using its ID.
 *     parameters:
 *       - name: account_transition_id
 *         in: path
 *         required: true
 *         description: ID of the income transition to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully marked the income transition as deleted.
 */
router.put(
  "/delete_transition_income/:account_transition_id",
  transitionGroupController.delete_transition_income
);

/**
 * @swagger
 * /transition_bank:
 *   get:
 *     tags:
 *       - Transition Group
 *     summary: Get Bank Transitions
 *     description: Retrieve all bank transitions.
 *     responses:
 *       200:
 *         description: Successfully retrieved bank transitions.
 */
router.get("/transition_bank", transitionGroupController.get_Bank_Transition);

module.exports = router;
