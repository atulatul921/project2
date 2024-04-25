const Student = require("../models/students");
const Test = require("../models/test");
const Result = require("../models/result");
const TestDetail = require("../models/testDetails");

const getAllTests = async (_, res) => {
  try {
    const testDetails = await TestDetail.find();
    return res.status(200).json({
      status: 200,
      testDetails,
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      testDetails: null,
      message: e.message,
    });
  }
};

const getTestsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (student) {
      let tests = await Test.find().populate("testDetail");
      tests = tests.filter((test) =>
        test.attendedStudents.includes(student._id) && !test.completedStudents.includes(student._id)
      );
      tests = tests.filter((test) => {
        const now = Date.now();
        const start = Date.parse(test.startTime);
        const end = Date.parse(test.endTime);

        return now > start && now < end;
      });
      return res.status(200).json({
        status: 200,
        tests,
      });
    }
  } catch (exception) {
    return res.status(400).json({
      status: 400,
      studentId: null,
      testDetails: null,
      message: exception.message,
    });
  }
};

const createTest = async (req, res) => {
  const { topic, passingMarks, totalMarks, questions } = req.body;
  if (topic && passingMarks && totalMarks && questions) {
    const createdTest = await TestDetail.create({
      topic,
      passingMarks,
      totalMarks,
      questions,
    });
    return res.status(201).json({
      status: 201,
      createdTest,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Required fields are not provided!",
    });
  }
};

const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    let test = await Test.findById(id).populate("testDetail");
    return res.status(200).json({
      status: 200,
      test,
    });
  } catch (exception) {
    return res.status(400).json({
      status: 400,
      test: null,
      message: exception.message,
    });
  }
};

const updateTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    const { topic, passingMarks, totalMarks, questions } = req.body;
    if (topic && passingMarks && totalMarks && questions) {
      const test = await TestDetail.findById(testId);
      const updatedTest = await test.updateOne({
        topic,
        passingMarks,
        totalMarks,
        questions,
      });
      test.save();
      return res.status(200).json({
        status: 200,
        updatedTest,
      });
    }
  } catch (exception) {
    return res.status(400).json({
      status: 400,
      test: null,
      message: exception.message,
    });
  }
};

const deleteTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await TestDetail.findById(testId);
    return res.status(200).json({
      status: 200,
      test,
    });
  } catch (exception) {
    return res.status(400).json({
      status: 400,
      test: null,
      message: exception.message,
    });
  }
};

const makeStudentAttendTest = async (req, res) => {
  try {
    const { student_ids, startTime, endTime } = req.body;
    const { id } = req.params;
    if (student_ids && id) {
      const students = await Student.find({
        _id: student_ids,
      });
      const testDetail = await TestDetail.findById(id);
      // testDetail.attendedStudents = students;
      const test = await Test.create({
        testDetail,
        attendedStudents: students,
        startTime,
        endTime,
      });
      students.forEach((student) => {
        if (!student.tests.includes(test)) student.tests.push(test);
        student.save();
      });

      testDetail.save();
      return res.status(200).json({
        status: 200,
        message: "Test assigned to selected students",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Required data is not provided!",
      });
    }
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

const completeTest = async (req, res) => {
  const { id } = req.params;
  const { studentId, attendedStudents, testDetail, startTime, endTime } = req.body;
  const { questions, topic, passingMarks, totalMarks } = testDetail;

  //Getting all the required models
  const test = await Test.findById(id).populate('testDetail')
  const student = await Student.findById(studentId)
  const marksPerQuestion = totalMarks / questions.length

  const alreadyExists = await Result.findOne({
    student,
    test
  })
  if (alreadyExists) return res.status(400).json({ status: 400, message: "Cannot attend tests multiple times" })
  console.log(alreadyExists);
  const result = new Result({
    test: test._id,
    student: student._id,
    marks: {
      receivedMarks: 0,
      totalMarks
    }
  })

  if (test.attendedStudents.includes(student._id)) {
    const now = Date.now();
    const start = Date.parse(test.startTime);
    const end = Date.parse(test.endTime);

    if (now > start && now < end) {
      for (let q = 0; q < test.testDetail.questions.length; q++) {

        let correctAnswer = true
        for (let a = 0; a < test.testDetail.questions[q].answers.length; a++) {
          if ((test.testDetail.questions[q].answers[a].correct)) {
            if (!questions[q].answers[a].selectedAnswer)
              correctAnswer = false
          }
          if (!test.testDetail.questions[q].answers[a].correct) {
            if (questions[q].answers[a].selectedAnswer)
              correctAnswer = false
          }

        }
        if (correctAnswer) {
          result.marks = {
            ...result.marks,
            receivedMarks: Number(result.marks.receivedMarks) + Number(marksPerQuestion)
          }

        }
      }
      test.completedStudents.push(student)
      test.save()
      result.save()
      return res.status(200).json({
        status: 200,
        attended: test,
        result
      })
    } else {
      return res.status(400).json({
        status: 400,
        message: "The time to attend test has passed!"
      })
    }
  } else {
    return res.status(400).json({
      status: 400,
      message: "Student cannot attend test!"
    })
  }
};

const getResultsOfStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id)
  const results = await Result.find({
    student
  }).populate('test')
  if (results) {
    return res.status(200).json({
      status: 200,
      results
    })
  } else {
    return res.status(400).json({
      status: 400,
      message: "Student or Result not found!"
    })
  }
}

module.exports = {
  getAllTests,
  getTestsForStudent,
  createTest,
  getTestById,
  updateTestById,
  deleteTestById,
  makeStudentAttendTest,
  completeTest,
  getResultsOfStudent
};
