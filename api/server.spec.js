const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

beforeEach(() => {
    return db.migrate.rollback()
        .then(() => db.migrate.latest())
        .then(() => db.seed.run())
});

test('POST /api/auth/register to be successful', async () => {
    const res = await request(server)
        .post('/api/auth/register')
        .send({username: 'User1', password: 'guest'})
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
        username: 'User1'
    })
    //console.log(res.body);
})

test('POST /api/auth/register to be unsuccessful when provided with blank username/password or numerical password', async () => {
    const res = await request(server)
        .post('/api/auth/register')
        .send({username: '', password: 'guest'})
    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({

    })
    console.log(res.body);
})

test('POST /api/auth/login to be successful', async () => {
    const register = await request(server)
        .post('/api/auth/register')
        .send({username: 'User1', password: 'guest'})
    const res = await request(server)
        .post('/api/auth/login')
        .send({username: 'User1', password: 'guest'})
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
        message: 'User1 is logged in',
    })
    expect(res.body).toHaveProperty("token")
    //console.log(res.body)
})

test('POST /api/auth/login unsuccessful when provided with invalid password', async () => {
    const register = await request(server)
        .post('/api/auth/register')
        .send({username: 'User1', password: 'guest'})
    const res = await request(server)
            .post('/api/auth/login')
            .send({username: 'User1', password: 'wrongpassword'})
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
        message: 'invalid username and/or password'
    })
})

test('GET /api/jokes to be successful', async () => {
    const register = await request(server)
        .post('/api/auth/register')
        .send({username: 'User1', password: 'guest'})
    const login = await request(server)
        .post('/api/auth/login')
        .send({username: 'User1', password: 'guest'})
    console.log(login.body.token)
    const res = await request(server)
        .get('/api/jokes')
        .set('authorization', login.body.token)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
})

test('GET /api/jokes to be unsuccessful when login fails', async () => {
    const register = await request(server)
        .post('/api/auth/register')
        .send({username: 'User1', password: 'guest'})
    const login = await request(server)
        .post('/api/auth/login')
        .send({username: 'User1', password: 'wrongpassword'})
    const res = await request(server)
        .get('/api/jokes')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
        you: 'shall not pass!'
    })
})