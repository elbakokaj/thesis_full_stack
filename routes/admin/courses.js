const express = require("express");
const router = express.Router();
const Courses = require("../../models/courses");
const Attendances = require("../../models/attendances");
const Users = require("../../models/users");

router.get("/find_specific_course/:professor_id", async (req, res) => {
    try {
        const courses = await Courses.find({ professorId: req.params.professor_id });
        const courseIds = courses.map(course => course._id);
        const attendance_dates = await Attendances.find({ courseId: { $in: courseIds } }).populate({
            path: "records.studentId",
            select: "firstName lastName",
            model: Users
        });;
        console.log('courses:', courses);
        console.log('attendance_dates:', attendance_dates);
        res.json({ courses, attendance_dates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;