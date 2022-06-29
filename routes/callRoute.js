const controller = require("../controllers/callController");

const router = require("express").Router();

router.post("/save-call-id", controller.saveCallId);
router.get("/get-call-id/:id", controller.getCallId);

module.exports = router;
