const express = require("express");
const router = express.Router();
const transitionController = require("../controllers/transition.controller");
const funTotal =require("../controllers/fundTotal.controller");
/**
 * @swagger
 * /transition:
 *   post:
 *     tags:
 *       - TransitionAll
 *     summary: Open a New Account
 *     description: Create and open a new account transition.
 *     responses:
 *       200:
 *         description: Successfully created and opened the account transition.
 */
router.post("/transition", transitionController.openAccount);

/**
 * @swagger
 * /sumbittrantision_suminsert:
 *   post:
 *     tags:
 *       - TransitionAll
 *     summary: Submit and Insert Account Summary
 *     description: Submit account transition details and insert the summary.
 *     responses:
 *       200:
 *         description: Successfully submitted and inserted the account summary.
 */
router.post("/sumbittrantision_suminsert", transitionController.sumAccount);

/**
 * @swagger
 * /transitions:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get All Transactions
 *     description: Retrieve all account transactions.
 *     responses:
 *       200:
 *         description: Successfully retrieved all transactions.
 */
router.get("/transitions", transitionController.getTransaction);

/**
 * @swagger
 * /transitionsubmit:
 *   put:
 *     tags:
 *       - TransitionAll
 *     summary: Submit Account Transition
 *     description: Submit and finalize an account transition.
 *     responses:
 *       200:
 *         description: Successfully submitted the account transition.
 */
router.put("/transitionsubmit", transitionController.sumbitTransition);
router.get("/getLastedFund", funTotal.getLastedFund);

/**
 * @swagger
 * /getGropTwo:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get Group Two Transitions
 *     description: Retrieve transitions from Group Two.
 *     responses:
 *       200:
 *         description: Successfully retrieved Group Two transitions.
 */

/**
 * @swagger
 * /getGropOne:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get Group One Transitions
 *     description: Retrieve transitions from Group One.
 *     responses:
 *       200:
 *         description: Successfully retrieved Group One transitions.
 */


/**
 * @swagger
 * /getSumGropOne:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get Sum of Group One
 *     description: Retrieve the total sum of values from Group One.
 *     responses:
 *       200:
 *         description: Successfully retrieved the sum of Group One values.
 */


/**
 * @swagger
 * /getAWG:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get Group Details for Account
 *     description: Retrieve specific group details for account transitions.
 *     responses:
 *       200:
 *         description: Successfully retrieved group details for the account.
 */

/**
 * @swagger
 * /transition-summary:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get Consolidated Transition Summary
 *     description: Retrieve all transition data including group transitions, sums, three type summary, and menu data in a single API call.
 *     responses:
 *       200:
 *         description: Successfully retrieved consolidated transition summary.
 *       401:
 *         description: Unauthorized or missing user ID.
 *       500:
 *         description: Server error retrieving transition summary.
 */

/**
 * @swagger
 * /transition-summary:
 *   get:
 *     tags:
 *       - TransitionAll
 *     summary: Get Consolidated Transition Summary
 *     description: Retrieve all transition data including group transitions, sums, three type summary, and menu data in a single API call.
 *     responses:
 *       200:
 *         description: Successfully retrieved consolidated transition summary.
 *       401:
 *         description: Unauthorized or missing user ID.
 *       500:
 *         description: Server error retrieving transition summary.
 */
router.get("/data_transition_open", transitionController.getTransitionSummary);

module.exports = router;
