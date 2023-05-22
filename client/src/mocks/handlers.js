import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
    rest.get('/courses/find_courses', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                {
                    _id: 'mock-course-id',
                    name: 'Mock Course',
                },
            ]),
        );
    }),

    // Add other request handlers as needed
];

const server = setupServer(...handlers);

export { server, rest };