const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode")


function professorAuth(req, res, next) {
    const authorization = req.headers.authorization;
    if (authorization) {
        const decode = jwtDecode(authorization)

        if (decode?.role == "professor") {
            req._id = decode?.id;
            req.email = decode?.email;
            req.role = decode?.role;
            next(); // call next() to move to the next middleware or route
        } else {
            res.status(401).json("You are not a professor!");
        }
    } else {
        res.status(401).json("You are not authenticated!");
    }
}


module.exports = professorAuth;