const express = require("express");
const router = express.Router();
const multer = require("multer");
const StudentController = require("../controllers/StudentController");

router.use("", require("./studentLoginRoute"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

//Student routes
router.get("/", StudentController.getAllStudents);
router.get("/:id", StudentController.getStudentById);
router.post("/", upload, StudentController.createStudent);
router.put("/:id", upload, StudentController.updateStudentById);
router.delete("/:id", StudentController.deleteStudentById);

//Student - Batch routes
router.put("/batches/add", StudentController.addBatchesToStudent);
router.post("/:id/assign/password", StudentController.assignPassword);

module.exports = router;
