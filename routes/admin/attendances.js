const express = require("express");
const router = express.Router();
const Attendances = require("../../models/attendances");

router.put("/update_attendance_records", async (req, res) => {
    try {
        const { courseId, groupId, date, records } = req.body;

        const attendanceRecord = await Attendances.findOne({
            courseId,
            groupId,
            date,
        });

        if (!attendanceRecord) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        // update the attendance record with the new records
        attendanceRecord.records = records.map((record) => ({
            studentId: record.studentId,
            status: record.status,
        }));

        const updatedAttendanceRecord = await attendanceRecord.save();

        res.status(200).json({
            message: "Attendance records updated successfully",
            attendanceRecord: updatedAttendanceRecord,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;