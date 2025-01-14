const express = require("express");
const router = express.Router();
const bankControllers = require("../controllers/bankTransitionController");

router.post(
  "/bank_trantisionInsert",
  bankControllers.openAccountGroup_bankTransition
);
router.post("/bank_borrow", bankControllers.creditor_borrow_bankTransition);
router.post("/bank_return", bankControllers.creditor_return_bankTransition);

// เส้นนี้
router.delete(
  "/reuse_return_bank/:account_transition_id",
  bankControllers.delFor_return_objectvalue
);

module.exports = router;
