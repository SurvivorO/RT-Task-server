import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, clearDB } from './db.js';
import User from '../src/models/user.model.js';
import jwt from 'jsonwebtoken';

beforeAll(async () => await connectDB());
afterAll(async () => await disconnectDB());

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await clearDB();
    // Pre-populate a user for login tests
    await request(app).post('/users').send({
      email: 'existing@dev.com',
      password: 'password123',
      displayName: 'Existing User'
    });
  });

  describe('POST /users/', () => {
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
      expect(response.body.token).toBeDefined();

      // Verify the token payload contains the user ID
      const decoded = jwt.decode(response.body.token);
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
        email: 'ghost@dev.com',
        password: 'password123'
      });

      expect(response.statusCode).toBe(401);
    });
  });
});