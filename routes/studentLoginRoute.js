const express = require("express");
const StudentController = require('../controllers/StudentController')
const router = express.Router();

router.post("/login", StudentController.loginStudent)

module.exports = router