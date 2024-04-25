const Course = require("../models/course");

const getAllCourses = async (_, res) => {
  const courses = await Course.find();
  res.status(200).json({ courses });
};

const createCourse = async (req, res) => {
  try {
    const { name, desc, duration, fees } = req.body;
    const course = await Course.create({
      name,
      desc,
      duration,
      fees,
    });
    res.status(201).json({ status: 201, created: true, course });
  } catch (error) {
    res.status(201).json({
      status: 201,
      created: false,
      message: error.message,
      course: null,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
    });
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const updateCourseById = async (req, res) => {
  const { name, desc, duration, fees } = req.body;
  try {
    const course = await Course.findOne({
      _id: req.params.id,
    });
    const updatedCourse = await course.updateOne({
      name,
      desc,
      duration,
      fees,
    });
    res.status(200).json({ status: 200, updatedCourse });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
    });
    if (!course)
      return res
        .status(404)
        .json({ status: 404, message: "Student not found!" });
    const deletedCourse = await course.deleteOne();
    res.status(200).json({
      status: 200,
      deleted: batch.$isDeleted(),
      deletedCourse,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
};
