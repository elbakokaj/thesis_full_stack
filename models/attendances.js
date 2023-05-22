const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const attendanceSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    courseId: {
        type: String,
        required: true,
    },
    groupId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    records: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // reference to the User model
                required: true,
            },
            status: {
                type: String,
                enum: ["present", "absent", "excused"],
                required: true,
            },
        },
    ],

})
const Attendances = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendances;