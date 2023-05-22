const router = require("../admin/courses");
const request = require("supertest");
const express = require("express");
const app = express();


// Mocking your models
const Courses = require("../../models/courses");
const Attendances = require("../../models/attendances");
const Users = require("../../models/users");

jest.mock("../../models/courses");
jest.mock("../../models/attendances");
jest.mock("../../models/users");

const mockAttendanceDates = [
    { courseId: "course1", date: "2023-05-01", records: [] },
    { courseId: "course2", date: "2023-05-02", records: [] },
];

Attendances.find = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue(mockAttendanceDates),
});

// Apply your routes to the express instance
app.use("/", router);

describe("GET /find_specific_course/:professor_id", () => {
    it("should return 200 and the specific courses with attendance dates", async () => {
        const mockCourses = [
            { _id: "course1", name: "Course 1" },
            { _id: "course2", name: "Course 2" },
        ];

        Courses.find.mockResolvedValue(mockCourses);

        const res = await request(app).get("/find_specific_course/prof1");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("courses", mockCourses);
        expect(res.body).toHaveProperty("attendance_dates", mockAttendanceDates);
    });

    it("should return 500 when internal server error", async () => {
        Courses.find.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).get("/find_specific_course/prof1");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Internal Server Error");
    });
});
