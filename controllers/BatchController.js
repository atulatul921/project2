const Batch = require("../models/batch");
const BatchTimings = require("../models/batchTimings");
const Student = require("../models/students");

const getAllBatches = async (_, res) => {
  const batches = await Batch.find().populate(["students", "timing"]);
  res.status(200).json({ batches });
};

const createBatch = async (req, res) => {
  const { name, info, timing_id } = req.body;
  const batchTiming = await BatchTimings.findOne({
    _id: timing_id,
  });
  const batch = await Batch.create({
    name,
    info,
    timing: batchTiming,
  });

  res.status(201).json({ status: 201, created: true, batch });
};

const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findOne({
      _id: req.params.id,
    }).populate(["students", "timing"]);
    res.status(200).json({ batch });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const updateBatchById = async (req, res) => {
  const { name, info, students, timing_id } = req.body;
  try {
    const batch = await Batch.findOne({
      _id: req.params.id,
    });
    const batchTiming = await BatchTimings.findById(timing_id);
    const student = await Student.find({
      _id: students,
    });
    batch.name = name;
    batch.info = info;
    batch.timing = batchTiming ? batchTiming : batch.timing;
    batch.students = student;
    student.forEach((stdnt) => {
      console.log(stdnt.batches);
      // if (!batch._id in stdnt.batches) {
      //   console.log("Inside if");
      stdnt.batches.push(batch);
      // }
      stdnt.save();
    });
    batch.save();
    res.status(200).json({ status: 200, batch: batch.toJSON() });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteBatchById = async (req, res) => {
  try {
    const batch = await Batch.findOne({
      _id: req.params.id,
    });
    if (!batch)
      return res
        .status(404)
        .json({ status: 404, message: "Student not found!" });
    const deletedBatch = await batch.deleteOne();
    res.status(200).json({
      status: 200,
      deleted: batch.$isDeleted(),
      deletedBatch,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const addStudentsToBatch = async (req, res) => {
  const { student_ids, batch_id } = req.body;
  if (student_ids && batch_id) {
    const students = await Student.find({
      _id: student_ids,
    });
    console.log(students);
    const batch = await Batch.findOne({
      _id: batch_id,
    }).populate("students");

    batch.students = students;

    students?.forEach((student) => {
      // student.batches.push(batch);
      if (!batch._id in student.batches) student.batches.push(batch._id);
      student.save();
    });

    batch.save();

    res.status(200).json({
      status: 200,
      batch,
      message: `Students ${student_ids} was added to bech ${batch_id}`,
    });
  }
};

const getStudentIdsByBatchId = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id).populate("students");
    const students = batch.students;
    return res.status(200).json({
      status: 200,
      student_ids: students,
    });
  } catch (exception) {
    return res.status(400).json({
      status: 400,
      student_ids: null,
      message: exception.message,
    });
  }
};

module.exports = {
  getAllBatches,
  createBatch,
  getBatchById,
  updateBatchById,
  deleteBatchById,
  addStudentsToBatch,
  getStudentIdsByBatchId,
};
