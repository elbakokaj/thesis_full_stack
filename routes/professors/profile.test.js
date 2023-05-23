const request = require("supertest");
const express = require("express");
const app = express();
const router = require("../professors/profile"); // Import the router

// Mocking your models
const Users = require("../../models/users");
jest.mock("../../models/users");

// Setup body parser middleware for PUT request
app.use(express.json());

// Apply your routes to the express instance
app.use("/", router);

describe("GET /:professor_id", () => {
    it("should return 200 and the specific user", async () => {
        const mockUser = { _id: "user1", name: "User 1" };

        Users.find.mockResolvedValue([mockUser]);

        const res = await request(app).get("/user1");

        expect(res.statusCode).toEqual(200);
        expect(res.body[0]).toEqual(mockUser);
    });

    it("should return 500 when internal server error", async () => {
        Users.find.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).get("/user1");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Internal Server Error");
    });
});

describe("PUT /edit/:professor_id", () => {
    it("should return 200 and the updated user", async () => {
        const mockUser = { _id: "user1", firstName: "Updated" };

        Users.findByIdAndUpdate.mockResolvedValue(mockUser);

        console.log("Sending request...");

        const res = await request(app).put("/edit/user1").send({ firstName: "Updated" });

        console.log("Request complete!");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockUser);
    }); // Increased timeout



    it("should return 500 when internal server error", async () => {
        Users.findByIdAndUpdate.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).put("/edit/user1").send({ firstName: "Updated" });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error", "Server error");
    });
});

// describe("PUT /change_password/:professor_id", () => {
//     it("should return 200 and a success message if old password matches", async () => {
//         const mockUser = { _id: "user1", password: "oldPassword" };

//         Users.findByIdAndUpdate.mockResolvedValue(mockUser);

//         const res = await request(app).put("/change_password/user1").send({ old_password: "oldPassword", new_password: "newPassword" });

//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty("message", "Password changed sucesfully!");
//     });

//     it("should return 200 and an error message if old password does not match", async () => {
//         const mockUser = { _id: "user1", password: "oldPassword" };

//         Users.findByIdAndUpdate.mockResolvedValue(mockUser);

//         const res = await request(app).put("/change_password/user1").send({ old_password: "wrongPassword", new_password: "newPassword" });

//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty("message", "Old passwords do not match!");
//     });

//     it("should return 500 when internal server error", async () => {
//         Users.findByIdAndUpdate.mockImplementation(() => {
//             throw new Error();
//         });

//         const res = await request(app).put("/change_password/user1").send({ old_password: "oldPassword", new_password: "newPassword" });

//         expect(res.statusCode).toEqual(500);
//         expect(res.body).toHaveProperty("error", "Server error");
//     });
// });
