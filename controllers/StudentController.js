const Student = require("../models/students");
const Course = require("../models/course");
const Batch = require("../models/batch");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "THE ONE PIECE IS REAL!";

const loginStudent = async (req, res) => {
  const { email, rawPassword } = req.body;

  const student = await Student.findOne({
    email,
  });
  if (!student) {
    return res.status(500).json({
      status: 500,
      message: "Student doesn't exists!",
      user: null,
      token: null,
    });
  }
  // console.log(student.password);
  if (student.password) {
    // const matchPassword = await bcrypt.compare(rawPassword, student.password);
    const matchPassword = rawPassword == student.password;
    console.log(rawPassword, student.password);
    if (!matchPassword)
      return res.status(500).json({
        status: 500,
        message: "Credentials doen't match!",
        user: null,
        token: null,
      });

    const token = jwt.sign(
      {
        user: student,
        admin: false,
      },
      SECRET_KEY,
      {
        expiresIn: "72h", // expires in 72 hours
      }
    );
    return res.status(200).json({
      status: 200,
      message: "Student authenticated",
      authenticatedUser: student,
      token,
    });
  } else
    return res.status(400).json({
      status: 400,
      message: "Student's password is not provided yet",
    });
};

const getAllStudents = async (req, res) => {
  const students = await Student.find().populate("batches");
  res.status(200).json({ students });
};

const createStudent = async (req, res) => {
  try {
    const {
      name,
      desc,
      email,
      phone,
      address,
      stream,
      dob,
      enrolled = false,
      course_ids = [],
    } = req.body;
    if (name && email && phone && address) {
      const student = await Student.create({
        name,
        desc,
        email,
        phone,
        address,
        stream,
        dob,
        enrolled,
      });
      if (req.file) student.image = req.file.filename;
      console.log("COURSE IDS - " + course_ids);
      if (course_ids && course_ids != []) {
        console.log("Got course id!");
        const courses = await Course.find({
          _id: course_ids,
        });

        student.courses = courses;

        student.populate("courses");

        courses?.forEach((course) => {
          course.students.push(student._id);
          course.save();
        });
      }

      student.save();
      res.status(201).json({ status: 201, created: true, student });
    } else {
      res.status(400).json({
        status: 400,
        created: false,
        message: "Required fields are empty!",
        student: null,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: 400,
      message: e.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
    }).populate(["courses", "batches"]);
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const updateStudentById = async (req, res) => {
  const { name, email, phone, address, stream, dob, enrolled, courses } =
    req.body;
  let new_image = "";
  try {
    const student = await Student.findOne({
      _id: req.params.id,
    });

    if (req.file) {
      new_image = req.file.filename;
      console.log(new_image);
      fs.unlinkSync("../uploads/" + student.image);
    } else {
      new_image = student.image;
    }

    const course = await Course.find({
      _id: courses,
    });

    const updatedStudent = await student.updateOne({
      name,
      email,
      phone,
      address,
      stream,
      dob,
      enrolled,
    });

    student.courses = course;
    student.image = new_image;
    course.forEach((cs) => {
      if (!student._id in cs.students) cs.students.push(student);
      cs.save();
    });

    student.save();

    res.status(200).json({ status: 200, updatedStudent });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
    });
    if (!student)
      return res
        .status(404)
        .json({ status: 404, message: "Student not found!" });
    const deletedStudent = await student.deleteOne();
    res.status(200).json({
      status: 200,
      deleted: student.$isDeleted(),
      deletedStudent,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const addBatchesToStudent = async (req, res) => {
  try {
    const { student_id, batch_ids } = req.body;
    if (student_id && batch_ids) {
      const batches = await Batch.find({
        _id: batch_ids,
      });
      console.log(batches);
      const student = await Student.findOne({
        _id: student_id,
      }).populate("batches");

      student.batches = batches;

      batches?.forEach((batch) => {
        // student.batches.push(batch);
        if (!student._id in batch.students) batch.students.push(student._id);
        batch.save();
      });

      student.save();

      res.status(200).json({
        status: 200,
        student,
        message: `Student ${student_id} was added to bech ${batch_ids}`,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      student: none,
      message: error.message,
    });
  }
};

const addCoursesToStudent = async (req, res) => {
  const { student_id, course_ids } = req.body;
  if (student_id && course_ids) {
    const courses = await Course.find({
      _id: course_ids,
    });
    console.log(courses);
    const student = await Student.findOne({
      _id: student_id,
    })
      .populate("courses")
      .populate("batches");

    courses?.forEach((course) => {
      student.batches.push(course);
      course.students.push(student._id);
      course.save();
    });

    student.save();

    res.status(200).json({
      status: 200,
      student,
      message: `Courses ${course_ids} was added to Student ${student_id}`,
    });
  }
};

const assignPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const student = await Student.findById(id);
  if (student && password) {
    student.password = password;
    student.save();
    return res.status(200).json({
      status: 200,
      message: "Password assigned to " + student.name,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Required parameters are not provided!",
    });
  }
};

module.exports = {
  loginStudent,
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  addBatchesToStudent,
  assignPassword,
};
