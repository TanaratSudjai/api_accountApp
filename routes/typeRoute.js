const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeController");

router.post("/account_type_create", typeController.CreateAccountType);
router.put(
  "/account_type_update/:account_type_id",
  typeController.UpdateAccountType
);
router.get("/account_type_get", typeController.GetAccountType);
router.get(
  "/account_type_get/:account_type_id",
  typeController.GetAccountTypeId
);
router.delete(
  "/account_type_del/:account_type_id",
  typeController.DeleteAccountTypeId
);

// router.put("/type_sum_insert/:account_type_id", typeController.insertSumtype);
module.exports = router;
