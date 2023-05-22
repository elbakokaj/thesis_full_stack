const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../admin/users');

// Mocking your models
const Users = require('../../models/users');
jest.mock('../../models/users');

// Apply your routes to the express instance
app.use('/', router);

describe('GET /find_all_professors', () => {
    it('should return 200 and the list of professors', async () => {
        const mockUsers = [
            { _id: 'prof1', role: 'professor' },
            { _id: 'prof2', role: 'professor' },
            { _id: 'prof3', role: 'professor' },
        ];

        Users.find.mockResolvedValue(mockUsers);

        const res = await request(app).get('/find_all_professors');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockUsers);
    });

    it('should return 500 when there is an internal server error', async () => {
        Users.find.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).get('/find_all_professors');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
    });
});
