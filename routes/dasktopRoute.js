const express = require("express");
const router = express.Router();
const dataDasktopController = require("../controllers/dataDasktopController");

router.get("/dasktop_data", dataDasktopController.getNameType);
router.get("/dasktop_data_sumtype", dataDasktopController.get_sumvalue_type);

module.exports = router;
