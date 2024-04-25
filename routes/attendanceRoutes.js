const express = require("express");
const router = express.Router();
const {
  getAttendance,
  getAttendanceForStudent,
  makeStudentsAttend,
  makeStudentUnattend,
} = require("../controllers/AttendanceController");

router.get("/", getAttendance);
router.get("/:date", getAttendanceForStudent);
router.post("/attend/:date", makeStudentsAttend);
router.delete("/:studentId/:batchId", makeStudentUnattend);

module.exports = router;
