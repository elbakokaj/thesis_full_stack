const request = require("supertest");
const express = require("express");
const app = express();
const router = require("../students/courses"); // Import your router

// Mock your Courses model
const Courses = require("../../models/courses");
jest.mock("../../models/courses");

// Apply your routes to the express instance
app.use("/", router);

describe("GET /course_name/:studentId", () => {
    it("should return 200 and the specific courses", async () => {
        const mockCourses = [{ name: "Course 1", semester: "Spring", professorId: "prof1", course_date: "2023-01-01" }];

        Courses.aggregate.mockResolvedValue(mockCourses);

        const res = await request(app).get("/course_name/student1");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockCourses);
    });

    it("should return 404 when no courses are found", async () => {
        Courses.aggregate.mockResolvedValue([]);

        const res = await request(app).get("/course_name/student1");

        expect(res.statusCode).toEqual(404);
        expect(res.text).toBe("No courses found for the given student ID.");
    });

    it("should return 500 when internal server error", async () => {
        Courses.aggregate.mockImplementation(() => Promise.reject(new Error()));

        const res = await request(app).get("/course_name/student1");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Internal Server Error");
    }, 10000); // setting timeout of 10s


});
