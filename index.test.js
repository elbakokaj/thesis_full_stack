const request = require("supertest");
const app = require("./index");

jest.mock("./middleware/adminAuth", () => {
    return (req, res, next) => next();
});

jest.mock("./middleware/studentAuth", () => {
    return (req, res, next) => next();
});

jest.mock("./middleware/profesorAuth", () => {
    return (req, res, next) => next();
});

describe("Test routes", () => {
    it("should test /servertest route", async () => {
        const response = await request(app).get("/servertest");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("API RUNNING");
    });

    // Write similar tests for your other routes
});
