const BatchTiming = require("../models/batchTimings");

const getAllBatchTimings = async (_, res) => {
  try {
    const batchTimings = await BatchTiming.find();
    if (batchTimings) {
      res.status(200).json({
        status: 200,
        timings: batchTimings,
      });
    }
  } catch (exception) {
    res.status(400).json({
      status: 400,
      message: exception.message,
      timings: null,
    });
  }
};

const getBatchTimingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const batchTiming = await BatchTiming.findById(id);
      res.status(200).json({
        status: 200,
        timing: batchTiming,
      });
    }
  } catch (exception) {
    res.status(400).json({
      status: 400,
      message: exception.message,
      timings: null,
    });
  }
};

const createBatchTiming = async (req, res) => {
  try {
    const { time } = req.body;
    if (time) {
      const batchTiming = await BatchTiming.create({
        time,
      });
      res.status(201).json({
        status: 201,
        createdTiming: batchTiming,
      });
    }
  } catch (exception) {
    res.status(400).json({
      status: 400,
      message: exception.message,
      timings: null,
    });
  }
};

const updateBatchTimingById = async (req, res) => {
  try {
    const { timingId } = req.params;
    const { newTiming } = req.body;
    if (timingId) {
      const batchTiming = await BatchTiming.findByIdAndUpdate(timingId, {
        timing: newTiming,
      });

      res.status(200).json({
        status: 200,
        updatedTiming: batchTiming,
      });
    }
  } catch (exception) {
    res.status(400).json({
      status: 400,
      message: exception.message,
      timings: null,
    });
  }
};

const deleteBatchTimingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const batchTiming = await BatchTiming.findByIdAndDelete(id);
      res.status(200).json({
        status: 200,
        timing: batchTiming,
      });
    }
    else {
      res.status(400).json({
        status: 400,
        message: "Please provide a valid batch timing id"
      })
    }
  } catch (exception) {
    res.status(400).json({
      status: 400,
      message: exception.message,
      timings: null,
    });
  }
};

module.exports = {
  getAllBatchTimings,
  getBatchTimingById,
  createBatchTiming,
  updateBatchTimingById,
  deleteBatchTimingById,
};
