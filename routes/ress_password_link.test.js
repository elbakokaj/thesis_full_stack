const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./ress_password_link');  // Your Express Router file

app.use(bodyParser.json());
app.use(router);

const mockUser = {
    email: 'test@test.com',
    resetPasswordToken: null,
    resetPasswordExpires: null,
};

jest.mock('../models/users', () => ({
    findOne: jest.fn().mockImplementation((query) => {
        if (query.email === mockUser.email || query.resetPasswordToken === mockUser.resetPasswordToken) {
            return mockUser;
        }
        return null;
    }),
    save: jest.fn(),
}));

describe('POST /link', () => {
    it('should return 400 if user not found', async () => {
        const res = await request(app)
            .post('/link')
            .send({ email: 'notexist@test.com' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User not found');
    });

    // Add more test cases for successful scenarios
});

describe('GET /reset-password/:token', () => {
    it('should return 400 if token is invalid or expired', async () => {
        const res = await request(app)
            .get('/reset-password/invalidtoken');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Password reset token is invalid or has expired');
    });

    // Add more test cases for successful scenarios
});
