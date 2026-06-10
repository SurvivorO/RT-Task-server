import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, clearDB } from './db.js';
import User from '../src/models/user.model.js';
import jwt from 'jsonwebtoken';

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    // Pre-populate a user for login tests
    await request(app).post('/users').send({
      email: 'existing@dev.com',
      password: 'password123',
      displayName: 'Existing User'
    });
  });

  describe('POST /users', () => {
    it('should register a new user and return 201 without the password', async () => {
      const response = await request(app).post('/users').send({
        email: 'new@dev.com',
        password: 'securepassword',
        displayName: 'New User'
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.email).toBe('new@dev.com');
      expect(response.body.password).toBeUndefined();
    });

    it('should return 400 if email already exists', async () => {
      const response = await request(app).post('/users').send({
        email: 'existing@dev.com', // Already exists from beforeEach
        password: 'newpassword',
        displayName: 'Copycat'
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /users/login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const response = await request(app).post('/users/login').send({
        email: 'existing@dev.com',
        password: 'password123'
      });

      expect(response.statusCode).toBe(200);

      // Extract the cookie array from the response headers
      const cookies = response.headers["set-cookie"];

      // Assert the cookie exists and contains your token name
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain("token=");

      // FIX: Extract the JWT value from the raw cookie string before decoding
      const rawCookieString = cookies[0];
      const tokenValue = rawCookieString.split(";")[0].split("=")[1];

      const decoded = jwt.decode(tokenValue);
      expect(decoded).not.toBeNull();
      expect(decoded.id).toBeDefined();
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app).post('/users/login').send({
        email: 'existing@dev.com',
        password: 'wrongpassword'
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.token).toBeUndefined();
    });

    it('should return 401 for non-existent email', async () => {
      const response = await request(app).post('/users/login').send({
        email: 'nobody@dev.com',
        password: 'password123'
      });

      expect(response.statusCode).toBe(401);
    });
  });
});