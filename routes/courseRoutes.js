const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/CourseController");

//Batch routes
router.get("/", CourseController.getAllCourses);
router.get("/:id", CourseController.getCourseById);
router.post("/", CourseController.createCourse);
router.put("/:id", CourseController.updateCourseById);
router.delete("/:id", CourseController.deleteCourseById);

module.exports = router;
