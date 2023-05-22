const express = require("express");
const router = express.Router();
const Attendances = require("../../models/attendances");
const Users = require("../../models/users");
const Courses = require("../../models/courses");
const mongoose = require("mongoose");

router.get("/find_taken_attendances", async (req, res) => {
    try {
        const attendances = await Attendances.find().populate({
            path: "records.studentId",
            select: "firstName lastName",
            model: Users
        });
        console.log("attendances", attendances)
        res.json(attendances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// THIS ROUTE IS USED TO GET ALL THE STUDENTS THAT ATTEND THE COURSE OF THAT PROFESOR SO THAT THE PROFESSOR MAY LATER ON USE THE ROUTE {{{{ store_students_attendances  }}} TO STORE THE ATTENDENCE OF THOSE STUDENTS
router.get("/find_students/:course_id", async (req, res) => {
    try {
        const allAttendances = await Attendances.findOne({ courseId: req.params.course_id });
        const allUsers = await Users.find();

        const records = allAttendances?.records?.filter((el) => el.studentId);
        // console.log('records', records)
        const all_students_that_attend = [];
        for (const element of records) {
            const student = allUsers.find((user) => user._id.toString() === element.studentId.toString());
            if (student) {
                var name = student?.firstName
                var status = element
                const myJSON = {
                    name, status: {
                        studentId: element.studentId,
                        status: "",
                        _id: element._id
                    },
                }
                all_students_that_attend.push(myJSON);
            }

        }
        res.json(all_students_that_attend);

    } catch (error) {
        console.error("erroriii", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/store_students_attendances", async (req, res) => {
    try {
        const { courseId, groupId, date, attendanceRecords } = req.body;

        // console.log('attendanceRecords', attendanceRecords)
        const newRecords = await attendanceRecords.map((attendance) => ({
            studentId: attendance?.status?.studentId,
            status: attendance?.status?.status,
        }));
        // console.log('courseId', courseId)
        const attendanceRecord = await Attendances.create({
            _id: new mongoose.Types.ObjectId().toString(),
            courseId,
            groupId: new mongoose.Types.ObjectId().toString(),
            date: new Date(),
            records: newRecords,
        });

        res.status(200).json({ message: "Attendance saved successfully", attendanceRecord });
    } catch (error) {
        console.error('Erroir:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;