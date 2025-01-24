const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/**
 * @swagger
 * /categoryCr:
 *   post:
 *     summary: Create Credit Category
 *     description: Add a new credit category to the system.
 *     responses:
 *       200:
 *         description: Credit category created successfully.
 */
router.post("/categoryCr", categoryController.createCategoryCr);

/**
 * @swagger
 * /categoryDr:
 *   post:
 *     summary: Create Debit Category
 *     description: Add a new debit category to the system.
 *     responses:
 *       200:
 *         description: Debit category created successfully.
 */
router.post("/categoryDr", categoryController.createCategoryDr);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get All Categories
 *     description: Retrieve a list of all categories in the system.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of categories.
 */
router.get("/category", categoryController.getCategory);

/**
 * @swagger
 * /category/{account_category_id}:
 *   put:
 *     summary: Update Category
 *     description: Update details of a specific category using its ID.
 *     parameters:
 *       - name: account_category_id
 *         in: path
 *         required: true
 *         description: ID of the category to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category updated successfully.
 */
router.put("/category/:account_category_id", categoryController.updateCategory);

/**
 * @swagger
 * /category/{account_category_id}:
 *   get:
 *     summary: Get Category by ID
 *     description: Retrieve details of a specific category using its ID.
 *     parameters:
 *       - name: account_category_id
 *         in: path
 *         required: true
 *         description: ID of the category to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the category details.
 */
router.get("/category/:account_category_id", categoryController.getCategoryId);

module.exports = router;
