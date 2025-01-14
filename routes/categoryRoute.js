const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/categoryCr", categoryController.createCategoryCr);
router.post("/categoryDr", categoryController.createCategoryDr);
router.get("/category", categoryController.getCategory);
router.put("/category/:account_category_id", categoryController.updateCategory);
router.get("/category/:account_category_id", categoryController.getCategoryId);

module.exports = router;
