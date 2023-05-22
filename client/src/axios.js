import axios from "axios";
import jwtDecode from "jwt-decode";

var auth = window?.localStorage?.getItem("token");

const decode = auth && jwtDecode(auth);
console.log('axios', decode)
const buildUrl = (decode) => {
    if (auth && decode.role == "student") {
        return "/api/student"
    }
    if (auth && decode.role == "professor") {
        return "/api/professor"
    }
    if (auth && decode.role == "admin") {
        return "/api/admin"
    } else {
        return ""
    }
}
const userRole = buildUrl(decode)
console.log('elba kokaj axios', "http://localhost:8000" + userRole)
const defaultInstance = axios.create({
    baseURL: "http://localhost:8000" + userRole,
    headers: {
        Authorization: auth
    }
})
export default defaultInstance;
// {
//     id: '642ede56cefc57e38fa3459d',
//     role: 'student',
//     email: 'student@example.com',
//     pass: '1234'
//   }
