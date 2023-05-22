const request = require("supertest");
const express = require("express");
const app = express();
const router = require("../admin/attendances"); // Import the router

// This would be your mocked model
const Attendances = require("../../models/attendances");

// Apply your routes to the express instance
app.use(express.json());
app.use("/", router);

jest.mock("../../models/attendances");

describe("PUT /update_attendance_records", () => {
    it("should return 200 and update attendance records successfully", async () => {
        const mockAttendance = {
            records: [],
            save: jest.fn().mockResolvedValue({ /* The updated record */ }),
        };

        Attendances.findOne.mockResolvedValue(mockAttendance);

        const res = await request(app)
            .put("/update_attendance_records")
            .send({
                courseId: "course1",
                groupId: "group1",
                date: "2023-05-19",
                records: [
                    { studentId: "student1", status: "present" },
                    { studentId: "student2", status: "absent" },
                    // Add more records as needed
                ],
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Attendance records updated successfully");
    });

    it("should return 404 when attendance record not found", async () => {
        Attendances.findOne.mockResolvedValue(null);

        const res = await request(app)
            .put("/update_attendance_records")
            .send({
                courseId: "course1",
                groupId: "group1",
                date: "2023-05-19",
                records: [],
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("message", "Attendance record not found");
    });

    it("should return 500 when internal server error", async () => {
        Attendances.findOne.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app)
            .put("/update_attendance_records")
            .send({
                courseId: "course1",
                groupId: "group1",
                date: "2023-05-19",
                records: [],
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Internal Server Error");
    });
});
