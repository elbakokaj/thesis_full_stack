const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    professorId: {
        type: Schema.Types.ObjectId,
        ref: 'Professor',
        required: true,
    },
    course_date: {
        type: Date,
        required: true,
    },
    group: {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        groupName: {
            type: String,
            required: true,
        },
        studentIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        }],
    },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
