const express = require("express");
const router = express.Router();
const TestController = require("../controllers/TestController");

router.get("/", TestController.getAllTests);
router.get("/:id", TestController.getTestById);
router.get("/byStudentId/:studentId", TestController.getTestsForStudent);
router.post("/", TestController.createTest);
router.put("/:id", TestController.updateTestById);
router.delete("/:id", TestController.deleteTestById);

router.post("/:id/attend", TestController.makeStudentAttendTest);
router.put("/:id/finish/test", TestController.completeTest)
router.get("/results/student/:id", TestController.getResultsOfStudent)

module.exports = router;
