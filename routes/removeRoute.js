const express = require("express");
const router = express.Router();
const removeController = require("../controllers/removeController");

/**
 * @swagger
 * /removetransition:
 *   delete:
 *     tags:
 *       - Remove
 *     summary: Delete all amount transitions
 *     description: Deletes all transition records from the database.
 *     responses:
 *       200:
 *         description: Successfully deleted all transition records.
 *       500:
 *         description: Internal server error.
 */
router.delete("/removetransition", removeController.removeDataTransition);

/**
 * @swagger
 * /removedatatype:
 *   put:
 *     tags:
 *       - Remove
 *     summary: Update or remove data by type ID
 *     description: Updates or removes data based on the provided type ID.
 *     parameters:
 *       - in: path
 *         name: params_id_type
 *         required: true
 *         description: The ID of the data type to be updated or removed.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully updated or removed the data type.
 *       400:
 *         description: Invalid type ID provided.
 *       500:
 *         description: Internal server error.
 */
router.put("/removedatatype", removeController.removeDataType);

module.exports = router;
