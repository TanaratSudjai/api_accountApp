const express = require("express");
const router = express.Router();
const AccountsReceivableAndBankController = require("../controllers/AccountsReceivableAndBank.controller");

router.put('/account_type_important_one_update/:account_group_id', AccountsReceivableAndBankController.MakeImportantToOne);

router.put('/account_type_important_zero_update/:account_group_id', AccountsReceivableAndBankController.MakeImportantToZero);

module.exports = router;