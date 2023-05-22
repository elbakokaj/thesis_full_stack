const request = require("supertest");
const express = require("express");
const app = express();
const router = require("../professors/attendances"); // Import the router
const mongoose = require("mongoose");

// Mocking your models
const Attendances = require("../../models/attendances");
const Users = require("../../models/users"); // Import Users model
jest.mock("../../models/attendances");
jest.mock("../../models/users"); // Mock Users model
app.use(express.json());
// Apply your routes to the express instance
app.use("/", router);

// Setup body parser middleware for POST request


const mockAttendances = [
    {
        _id: new mongoose.Types.ObjectId().toString(),
        courseId: "course1",
        groupId: "group1",
        date: new Date(),
        records: [
            {
                studentId: "student1",
                status: "present",
            },
            {
                studentId: "student2",
                status: "absent",
            },
        ],
    },
];
const mockUsers = [
    {
        _id: new mongoose.Types.ObjectId().toString(),
        firstName: "John",
        lastName: "Doe",
        // other user properties...
    },
    // other user objects...
];

const requestBody = {
    courseId: "course1",
    groupId: "group1",
    date: new Date().toISOString(),
    attendanceRecords: [
        {
            studentId: "student1",
            status: "present",
        },
        {
            studentId: "student2",
            status: "absent",
        },
    ],
};


Users.find.mockResolvedValue(mockUsers); // Now mockUsers is defined

// Implement mocking behavior for the 'find' method of the Attendances model
Attendances.find.mockImplementation(() => ({
    populate: jest.fn().mockResolvedValue(mockAttendances),
}));

Users.find.mockResolvedValue(mockUsers);
// Mocking Attendances.create
Attendances.create.mockResolvedValue({
    _id: new mongoose.Types.ObjectId().toString(),
    courseId: requestBody.courseId,
    groupId: requestBody.groupId,
    date: new Date(requestBody.date),
    records: requestBody.attendanceRecords.map((record) => ({
        studentId: record.studentId,
        status: record.status,
    })),
});
describe("GET /find_taken_attendances", () => {
    it("should return 200 and the list of attendances", async () => {
        const res = await request(app).get("/find_taken_attendances");

        // Parse dates in response back to Date objects for comparison
        const responseWithParsedDates = res.body.map(attendance => ({
            ...attendance,
            date: new Date(attendance.date)
        }));

        expect(res.statusCode).toEqual(200);
        expect(responseWithParsedDates).toEqual(mockAttendances);
    });


    it("should return 500 when internal server error", async () => {
        Attendances.find.mockImplementationOnce(() => {
            throw new Error();
        });

        const res = await request(app).get("/find_taken_attendances");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Internal Server Error");
    });
});

// Additional test cases for other routes...

describe('GET /find_students/:course_id', () => {
    it('should return 200 and the list of students', async () => {
        const mockCourseId = "course1";
        const mockAttendances = [
            // Mock your attendance objects here
        ];
        const mockUsers = [
            // Mock your user objects here
        ];

        Attendances.findOne.mockResolvedValue(mockAttendances);
        Users.find.mockResolvedValue(mockUsers);

        const res = await request(app).get(`/find_students/${mockCourseId}`);

        // Add your expectations here based on your application logic
    });

    it('should return 500 when there is an internal server error', async () => {
        const mockCourseId = "course1";
        Attendances.findOne.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).get(`/find_students/${mockCourseId}`);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
    });
});

describe("POST /store_students_attendances", () => {
    it("should return 200 and a success message", async () => {
        const res = await request(app)
            .post("/store_students_attendances")
            .send(requestBody);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Attendance saved successfully");
        expect(res.body).toHaveProperty("attendanceRecord");
    });

    it("should return 500 when internal server error", async () => {
        Attendances.create.mockImplementationOnce(() => {
            throw new Error();
        });

        const res = await request(app)
            .post("/store_students_attendances")
            .send(requestBody);

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Internal Server Error");
    });
});
afterAll(() => {
    mongoose.connection.close();
});
