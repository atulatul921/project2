const express = require("express");
const router = express.Router();
const BatchTimingController = require("../controllers/BatchTimingController");

router.get("/", BatchTimingController.getAllBatchTimings);
router.get("/:id", BatchTimingController.getBatchTimingById);
router.post("/", BatchTimingController.createBatchTiming);
router.put("/:id", BatchTimingController.updateBatchTimingById);
router.delete("/:id", BatchTimingController.deleteBatchTimingById);

module.exports = router;
