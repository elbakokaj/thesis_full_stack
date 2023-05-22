const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/adminAuth"); // adjust the path to your actual file

describe("adminAuth", () => {
    it("should pass request to next middleware if authorization token is valid", () => {
        const mockReq = {
            headers: {
                authorization: jwt.sign({ id: '1', email: 'test@example.com', role: 'admin' }, 'marinairPopaj') // adjust the 'secret' to your actual secret
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        adminAuth(mockReq, mockRes, mockNext);

        expect(mockReq._id).toBe('1');
        expect(mockReq.email).toBe('test@example.com');
        expect(mockReq.role).toBe('admin');
        expect(mockNext).toBeCalled();
    });

    it("should respond with 401 if authorization token is not provided", () => {
        const mockReq = {
            headers: {}
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        adminAuth(mockReq, mockRes, mockNext);

        expect(mockRes.status).toBeCalledWith(401);
        expect(mockRes.json).toBeCalledWith("You are not authenticated!");
        expect(mockNext).not.toBeCalled();
    });

    it("should respond with 401 if authorization token does not belong to a admin", () => {
        const mockReq = {
            headers: {
                authorization: jwt.sign({ id: '1', email: 'test@example.com', role: 'student' }, 'marinairPopaj') // adjust the 'secret' to your actual secret
            }
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockNext = jest.fn();

        adminAuth(mockReq, mockRes, mockNext);

        expect(mockRes.status).toBeCalledWith(401);
        expect(mockRes.json).toBeCalledWith("You are not a admin!");
        expect(mockNext).not.toBeCalled();
    });
});
