const Attendance = require("../models/attendance");
const Course = require("../models/course");
const Batch = require("../models/batch");

const getAttendance = async (req, res) => {
    try {
        const attendances = await Attendance.find().populate("batch", "students");
        return res.status(200).json({
            status: 200,
            attendances,
        });
    } catch (exception) {
        return res.status(400).json({
            status: 400,
            message: exception.message,
        });
    }
};

const getAttendanceForStudent = async (req, res) => {
    // try {
    const { date } = req.params;
    const { studentId, batchId } = req.query
    let attendance = null;
    if (!studentId && !batchId) {
        let xAttendance = await Attendance.findOne({ date }).populate('students');
        attendance = xAttendance;
    } else if (batchId && !studentId) {
        attendance = await Attendance.findOne({
            date,
            batch: batchId,
        });
    } else if (studentId && !batchId) {
        let xAttendance = await Attendance.findOne({ date }).populate('students');
        xAttendance = xAttendance.filter((atnd) => atnd.student.includes(studentId));
        attendance = xAttendance;
    } else if (studentId && batchId) {
        let xAttendance = await Attendance.findOne({
            date,
            batch: batchId,
        }).populate('students');
        attendance = xAttendance;
    }
    return res.status(200).json({
        status: 200,
        attendance,
    });
    // } catch (exception) {
    //     return res.status(400).json({
    //         status: 400,
    //         message: exception.message,
    //     });
    // }
};

const makeStudentsAttend = async (req, res) => {
    try {
        const { date } = req.params;
        const { courseId, studentIds, dayReport, batchId } = req.body;

        let xAttendance = await Attendance.findOne({
            date,
        });
        const course = await Course.findById(courseId);
        if (xAttendance) {
            xAttendance.dayReport = dayReport
            xAttendance.course = course;
            xAttendance.students = studentIds;
            xAttendance.save();
            return res.status(200).json({
                status: 200,
                message: "Student's attendance added!",
            });
        }
        const batch = await Batch.findById(batchId);
        const newAttendance = new Attendance({
            batch,
            course,
            date,
            dayReport,
        });
        newAttendance.students = studentIds;
        newAttendance.save();
        return res.status(200).json({
            status: 200,
            message: "Student's attendance added!",
        });
    } catch (exception) {
        return res.status(200).json({
            status: 200,
            message: exception.message,
        });
    }
};

const makeStudentUnattend = (req, res) => { };

module.exports = {
    getAttendance,
    getAttendanceForStudent,
    makeStudentsAttend,
    makeStudentUnattend,
};
