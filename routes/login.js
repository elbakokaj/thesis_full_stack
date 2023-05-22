const express = require("express");
const router = express.Router();
const sign = require('jwt-encode');
const jwt = require('jsonwebtoken');

const Users = require("../models/users");
const Courses = require("../models/courses");


router.post("/", async (req, res) => {
    try {
        const foundUser = await Users.findOne({ email: req.body.email });
        // const secret = process.env.SECRET_KEY
        // var passDecode = jwt.decode(req.body.pass, secret);
        console.log('shaban passwortd', foundUser.password, req.body.pass)
        // var passDecode1 = jwt_decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmVkZWUzY2VmYzU3ZTM4ZmEzNDU5ZSIsInJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InByb2Zlc3NvckBleGFtcGxlLmNvbSJ9.hla4XfgiTPVK4GR5YsVgH35AHz8h0VPhEnoZw7o7GG0");
        if (foundUser?.password == req.body.pass) {
            const secret = 'marinairPopaj';
            const professor_id = foundUser?._id
            const test = []
            if (foundUser?.role == "professor") {
                const foundCourse = await Courses.findOne({ professorId: professor_id });
                const myjson = foundCourse?._id
                test.push(myjson)
            }
            const data = {
                id: foundUser?._id,
                role: foundUser?.role,
                email: foundUser?.email,
                course_id: test[0]
            }
            let jwt = sign(data, secret);
            // console.log("tokeni qe me duhet", jwt);
            // console.log(decoded);
            res.json({ token: jwt });

        } else {
            res.json("Password is incorrect!");

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
module.exports = router;