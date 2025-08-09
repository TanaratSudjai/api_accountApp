const express = require("express");
const router = express.Router();
const typeController = require("../controllers/type.controller");
const fundTotalControllers = require("../controllers/fundTotal.controller");


router.put(
  "/sumbitPerDay",
  fundTotalControllers.sumbitPerDay
);

/**
 * @swagger
 * /account_type_create:
 *   post:
 *     tags:
 *       - Type
 *     summary: Create Account Type
 *     description: Create a new account type.
 *     responses:
 *       200:
 *         description: Successfully created the account type.
 */
router.post("/account_type_create", typeController.CreateAccountType);

/**
 * @swagger
 * /account_type_update/{account_type_id}:
 *   put:
 *     tags:
 *       - Type
 *     summary: Update Account Type
 *     description: Update an existing account type by its ID.
 *     parameters:
 *       - name: account_type_id
 *         in: path
 *         required: true
 *         description: The ID of the account type to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully updated the account type.
 */
router.put(
  "/account_type_update/:account_type_id",
  typeController.UpdateAccountType
);

/**
 * @swagger
 * /account_type_get:
 *   get:
 *     tags:
 *       - Type
 *     summary: Get All Account Types
 *     description: Retrieve all account types.
 *     responses:
 *       200:
 *         description: Successfully retrieved all account types.
 */
router.get("/account_type_get", typeController.GetAccountType);

/**
 * @swagger
 * /account_type_get/{account_type_id}:
 *   get:
 *     tags:
 *       - Type
 *     summary: Get Account Type by ID
 *     description: Retrieve details of a specific account type using its ID.
 *     parameters:
 *       - name: account_type_id
 *         in: path
 *         required: true
 *         description: The ID of the account type to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the account type details.
 */
router.get(
  "/account_type_get/:account_type_id",
  typeController.GetAccountTypeId
);

/**
 * @swagger
 * /account_type_del/{account_type_id}:
 *   delete:
 *     tags:
 *       - Type
 *     summary: Delete Account Type
 *     description: Delete an account type by its ID.
 *     parameters:
 *       - name: account_type_id
 *         in: path
 *         required: true
 *         description: The ID of the account type to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the account type.
 */
router.delete(
  "/account_type_del/:account_type_id",
  typeController.DeleteAccountTypeId
);

router.get(
  "/getLastedFund",
  fundTotalControllers.getLastedFund
);

router.post(
  "/updateLastedFund",
  fundTotalControllers.updateLastedFund
);

module.exports = router;
