const express = require("express");
const router = express.Router();
const BatchController = require("../controllers/BatchController");
const batchTimingRoute = require("./batchTimingRoute");

//Batch routes
router.get("/", BatchController.getAllBatches);
router.get("/:id", BatchController.getBatchById);
router.post("/", BatchController.createBatch);
router.put("/:id", BatchController.updateBatchById);
router.delete("/:id", BatchController.deleteBatchById);

router.put("/students/add", BatchController.addStudentsToBatch);
router.get("/:id/students/ids", BatchController.getStudentIdsByBatchId);

// router.use("/timing", batchTimingRoute);

module.exports = router;
