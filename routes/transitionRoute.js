const express = require("express");
const router = express.Router();
const transitionController = require("../controllers/transitionController");

router.post("/transition", transitionController.openAccount);

router.post("/sumbittrantision_suminsert", transitionController.sumAccount);

router.get("/transitions", transitionController.getTransaction);
router.put("/transitionsubmit", transitionController.sumbitTransition);

router.get("/getGropTwo", transitionController.getGroupTwoTransition);
router.get("/getGropOne", transitionController.getGroupOneTransition);

router.get("/getSumGropOne", transitionController.getSumValueGroupOne);
router.get("/getSumGropTwo", transitionController.getSumValueGroupTwo);
router.get("/getAWG", transitionController.getOnedeTwo);

module.exports = router;
