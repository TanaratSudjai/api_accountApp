const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

/**
 * @swagger
 * /account_group_create:
 *   post:
 *     tags:
 *       - Group
 *     summary: Create Account Group
 *     description: Create a new account group in the system.
 *     responses:
 *       200:
 *         description: Account group created successfully.
 */
router.post('/account_group_create', groupController.CreateAccountGroup);

/**
 * @swagger
 * /account_group_get:
 *   get:
 *     tags:
 *       - Group
 *     summary: Get All Account Groups
 *     description: Retrieve a list of all account groups in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved the account groups.
 */
router.get('/account_group_get', groupController.GetAccountGroup);

/**
 * @swagger
 * /account_group_get/{account_group_id}:
 *   get:
 *     tags:
 *       - Group
 *     summary: Get Account Group by ID
 *     description: Retrieve details of a specific account group using its ID.
 *     parameters:
 *       - name: account_group_id
 *         in: path
 *         required: true
 *         description: ID of the account group to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the account group details.
 */
router.get('/account_group_get/:account_group_id', groupController.GetAccountGroupById);

/**
 * @swagger
 * /account_group_del/{account_group_id}:
 *   delete:
 *     tags:
 *       - Group
 *     summary: Delete Account Group by ID
 *     description: Delete a specific account group using its ID.
 *     parameters:
 *       - name: account_group_id
 *         in: path
 *         required: true
 *         description: ID of the account group to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account group deleted successfully.
 */
router.delete('/account_group_del/:account_group_id', groupController.DeleteAccountGroupById);

/**
 * @swagger
 * /account_group_update/{account_group_id}:
 *   put:
 *     tags:
 *       - Group
 *     summary: Update Account Group by ID
 *     description: Update the details of a specific account group using its ID.
 *     parameters:
 *       - name: account_group_id
 *         in: path
 *         required: true
 *         description: ID of the account group to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account group updated successfully.
 */
router.put('/account_group_update/:account_group_id', groupController.UpdateAccountGroupById);

/**
 * @swagger
 * /account_group_counttype:
 *   get:
 *     tags:
 *       - Group
 *     summary: Get Account Group Type Count
 *     description: Retrieve the count of account groups by type.
 *     responses:
 *       200:
 *         description: Successfully retrieved the account group type count.
 */
router.get('/account_group_counttype', groupController.GetAccountTypeCount_group);

/**
 * @swagger
 * /account_group_counttype/{account_category_id}:
 *   get:
 *     tags:
 *       - Group
 *     summary: Get Account Group Type Count by Category ID
 *     description: Retrieve the count of account groups by type for a specific category.
 *     parameters:
 *       - name: account_category_id
 *         in: path
 *         required: true
 *         description: ID of the account category to retrieve the type count for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the account group type count for the category.
 */
router.get('/account_group_counttype/:account_category_id', groupController.GetAccountTypeCount_groupID);

module.exports = router;
