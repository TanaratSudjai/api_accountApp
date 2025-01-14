const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post('/account_group_create', groupController.CreateAccountGroup);
router.get('/account_group_get', groupController.GetAccountGroup);
router.get('/account_group_get/:account_group_id', groupController.GetAccountGroupById);
router.delete('/account_group_del/:account_group_id', groupController.DeleteAccountGroupById);
router.put('/account_group_update/:account_group_id', groupController.UpdateAccountGroupById);
router.get('/account_group_counttype', groupController.GetAccountTypeCount_group);
router.get('/account_group_counttype/:account_category_id', groupController.GetAccountTypeCount_groupID);

module.exports = router;
