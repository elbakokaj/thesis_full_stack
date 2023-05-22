const express = require("express");
require('dotenv').config();
const connectDB = require("./config/db")
const cors = require("cors");
const app = express();
const adminAuth = require("./middleware/adminAuth")
const studentAuth = require("./middleware/studentAuth")
const professorAuth = require("./middleware/profesorAuth");
const { JsonWebTokenError } = require("jsonwebtoken");
connectDB();

app.use(cors()); // enable CORS for all routes
app.use(express.json({ extended: false }))

const port = process.env.PORT || 8000;

const secret = process.env.SECRET_KEY

const encodePass = JsonWebTokenError

app.get("/servertest", (req, res) => res.send("API RUNNING"))

app.use("/api/login", require("./routes/login"))
app.use("/api/forgot-password", require("./routes/ress_password_link"))
app.use("/api/", require("./routes/ress_password_link"))



// profesroi ka me i gjet vetem kursmen me id te profesorit 
// kurse studenti ka me mujt me i gjet te gjitha kurset qe jan me id te studentit
// tek mesazhet ka me pas post nga ana e profesorit, kurse nga ana e studentit duhet te kete post fhe get (post per me ndryshu sttusin seen !) 
// 


// ADMIN ROOTS
app.use("/api/admin/attendances", adminAuth, require("./routes/admin/attendances"));
app.use("/api/admin/courses", adminAuth, require("./routes/admin/courses"));
app.use("/api/admin/users", adminAuth, require("./routes/admin/users"));
app.use("/api/admin/profile", adminAuth, require("./routes/admin/profile"));

// PROFESOR ROOTS
app.use("/api/professor/attendances", professorAuth, require("./routes/professors/attendances"));
app.use("/api/professor/profile", professorAuth, require("./routes/professors/profile"));

// STUDNET ROOTS
app.use("/api/student/attendances", studentAuth, require("./routes/students/attendances"));
app.use("/api/student/courses", studentAuth, require("./routes/students/courses"));
app.use("/api/student/profile", studentAuth, require("./routes/students/profile"));

// app.use("/api/mesages", require("./routes/mesages"))
// const server = app.listen(0, () => {
//     console.log(server.address())
//     const port = server.address().port;
//     console.log(`Server is running on port ${port}`);
// });
var server = app.listen(port, () => console.log(`Server started on port ${port}`))

module.exports = server;



