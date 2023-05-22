const express = require("express");
const router = express.Router();
const Attendances = require("../../models/attendances");

// router.get("/find_attendances", async (req, res) => {
//     try {
//         const attendances = await Attendances.find();
//         res.json(attendances);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

router.get("/find_specific_status", async (req, res) => {
    try {
        // Get the attendance data
        const attendanceData = await Attendances.find();
        const records = attendanceData.map((el) => el.records);
        const result = records.reduce((acc, val) => acc.concat(val), []) // flatten the records array
            .filter((record) => record?.studentId == req.query.student_id);
        console.log("result", result);


        var present = 0
        var absent = 0
        for (let index = 0; index < result.length; index++) {

            if (result[index]?.status == "present") {
                present++;
            }
            if (result[index]?.status == "absent") {
                absent++;
            }
        }
        const counts = { present: present, absent: absent }
        res.json(counts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }

});



module.exports = router;

