const mongoose = require("mongoose");
const { INTEGER } = require("sequelize");



const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    auth: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    yearOfEnrollment: {
        type: Number,
        integer: true,
        required: false,
    },
    consultationHours: {
        type: String,
        required: false
    },
    course: {
        type: String,
        require: false
    },
    resetPasswordToken: {
        type: String,
        require: false
    },
    resetPasswordExpires: {
        type: String,
        require: false
    }
})
const Users = mongoose.model('User', userSchema);
module.exports = Users;