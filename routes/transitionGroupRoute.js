const express = require("express");
const router = express.Router();
const transitionGroupController = require("../controllers/transitionGroupController");

router.get(
  "/getMenuGroup_expense",
  transitionGroupController.getMenuGroup_expense
);
router.get(
  "/getMenuGroup_income",
  transitionGroupController.getMenuGroup_income
);
router.get(
  "/getSelect_countSelect",
  transitionGroupController.getCountSelectTransition
);
router.put(
  "/getSelect_select/:account_type_id",
  transitionGroupController.UpdateValue
);

// submit transition group
router.post(
  "/transition_group_income_and_extend",
  transitionGroupController.submit_transition_group_income_extend
);

router.post(
  "/transition_select_expense",
  transitionGroupController.openAccountGroup_expense
);
router.post(
  "/transition_select_income",
  transitionGroupController.openAccountGroup_income
);

router.get("/get_type_from_id", transitionGroupController.getType_from_id);
router.get("/get_creditor", transitionGroupController.getCreditor);
router.get("/get_debtor", transitionGroupController.getDebtor);

router.get(
  "/get_expense_transition",
  transitionGroupController.get_expense_transition
);
router.get(
  "/get_income_transition",
  transitionGroupController.get_income_transition
);

router.delete(
  "/deletetransition/:account_transition_id",
  transitionGroupController.deleteTransition
);

router.put(
  "/delete_transition_expense/:account_transition_id",
  transitionGroupController.delete_transition_expense
);

router.put(
  "/delete_transition_income/:account_transition_id",
  transitionGroupController.delete_transition_income
);

router.get("/transition_bank", transitionGroupController.get_Bank_Transition);
module.exports = router;
