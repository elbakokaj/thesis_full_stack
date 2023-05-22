const express = require("express");
const router = express.Router();
const Courses = require("../../models/courses");

async function getCourses(studentId) {
    try {
        const courses = await Courses.aggregate([{ $match: { "group.studentIds": studentId } },
        {
            $project: {
                _id: 0,
                name: 1,
                semester: 1,
                professorId: 1,
                course_date: 1
            }
        }
        ]);

        if (courses.length > 0) {
            console.log(courses);
            return courses;
        } else {
            return null;
        }
    } catch (err) {
        throw err; // propagate the error up
    }
}

router.get('/course_name/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    try {
        const courses = await getCourses(studentId);

        if (courses) {
            res.send(courses);
        } else {
            res.status(401).send('No courses found this student!');
        }
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).send({ error: "Internal Server Error" });
    }
});


module.exports = router;