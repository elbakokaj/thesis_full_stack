const express = require("express");
const request = require("supertest");
const mongoose = require('mongoose');
const resetRouter = require("../routes/ress_password_link"); // replace with actual path to your file
const Users = require("../models/users");
const nodemailer = require('nodemailer');

jest.mock("../models/users", () => {
    return {
        findOne: jest.fn()
    }
});

jest.mock("nodemailer", () => {
    return {
        createTransport: jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValue(true),
        })
    }
});

describe("Password reset endpoints", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/api", resetRouter);
    });

    it("should send a reset password email if user exists", async () => {
        const userEmail = "test@example.com";

        // Mock the database response and mail transport
        const mockUser = {
            _id: new mongoose.Types.ObjectId(),
            email: userEmail,
            password: "password",
            save: jest.fn().mockResolvedValue(true),
        };
        Users.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/api/link")
            .send({ email: userEmail });

        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ message: "Password reset email sent" });
    });

    // Test when user is not found
    it("should return 400 when user is not found", async () => {
        Users.findOne.mockResolvedValue(null);
        const response = await request(app)
            .post("/api/link")
            .send({ email: "nonexistent@example.com" });

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ message: "User not found" });
    });
    // Test when the token is invalid or has expired
    it("should return 400 when token is invalid or has expired", async () => {
        Users.findOne.mockResolvedValue(null);
        const response = await request(app).get("/api/reset-password/invalidtoken");

        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ message: "Password reset token is invalid or has expired" });
    });

    // Test successful password reset
    it("should successfully reset password", async () => {
        const user = {
            email: "test@example.com",
            password: "oldPassword",
            resetPasswordToken: "validtoken",
            resetPasswordExpires: Date.now() + 3600000, // set expiry date to be in the future
            save: jest.fn().mockResolvedValue(true),
        };
        Users.findOne.mockResolvedValue(user);

        const response = await request(app).get("/api/reset-password/validtoken");
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({ message: "Password reset successful" });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
