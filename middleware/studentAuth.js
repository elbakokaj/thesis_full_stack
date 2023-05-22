const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode")


function studentAuth(req, res, next) {
    const authorization = req.headers.authorization;
    if (authorization) {
        const decode = jwtDecode(authorization)
        if (decode?.role == "student") {
            req._id = decode?.id;
            req.email = decode?.email;
            req.role = decode?.role;
            next(); // call next() to move to the next middleware or route
        } else {
            res.status(401).json("You are not a student!");
        }
    } else {
        res.status(401).json("You are not authenticated!");
    }
}


module.exports = studentAuth;