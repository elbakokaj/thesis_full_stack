const request = require("supertest");
const express = require("express");
const app = express();
const router = require("../students/attendances"); // Import the router

// Mocking your models
const Attendances = require("../../models/attendances");
jest.mock("../../models/attendances");

// Apply your routes to the express instance
app.use("/", router);

describe("GET /find_specific_status", () => {
    it("should return 200 and the attendance status of the student", async () => {
        const mockAttendances = [{
            _id: "attendance1",
            courseId: "course1",
            groupId: "group1",
            date: new Date(),
            records: [{
                studentId: "student1",
                status: "present"
            }, {
                studentId: "student1",
                status: "absent"
            }]
        }, {
            _id: "attendance2",
            courseId: "course2",
            groupId: "group2",
            date: new Date(),
            records: [{
                studentId: "student1",
                status: "present"
            }]
        }];

        Attendances.find.mockResolvedValue(mockAttendances);

        const res = await request(app).get("/find_specific_status").query({ student_id: "student1" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ present: 2, absent: 1 });
    });

    it("should return 500 when internal server error", async () => {
        Attendances.find.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).get("/find_specific_status").query({ student_id: "student1" });

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Server error");
    });
});
