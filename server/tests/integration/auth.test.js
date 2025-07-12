const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../src/models/User');

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Peter',
        email: 'peter123@gmail.com',
        password: '1234'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body.data.email).toBe(userData.email);
      expect(res.body).not.toHaveProperty('password');
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'John',
        email: 'invalid-email',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        name: 'Pauline',
        email: 'jane@test.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@test.com',
          password: 'password123'
        })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(userData.email);
    });
  });
});
