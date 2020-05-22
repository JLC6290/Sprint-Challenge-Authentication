const supertest = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

beforeEach(() => {
    return db.migrate.rollback()
        .then(() => db.migrate.latest())
        .then(() => db.seed.run())
});

test('POST /api/auth/register to be successful', () => {
    const res = await request(server)
        .post('/api/auth/register')
        .send({username: 'User1', password: 'guest'})
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
        username: 'User1'
    })
    // console.log(res.body);
})
