import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB, clearDB } from './db.js';
import User from '../src/models/user.model.js';
import Task from '../src/models/task.model.js';

beforeAll(async () => await connectDB());
afterAll(async () => await disconnectDB());

describe('Task Data Validation and API Endpoints', () => {
  let validUserId;

  beforeEach(async () => {
    await clearDB();
    const dummyUser = await User.create({
      displayName: 'testdev',
      email: 'test@dev.com',
      password: 'hashedpassword'
    });
    validUserId = dummyUser._id;
  });

  describe('1. Testing via Raw JSON (API Boundary)', () => {
    it('should successfully create a task via HTTP request', async () => {
      const rawJsonPayload = {
        description: 'Implement the POST endpoint',
        assignedTo: validUserId,
        status: 'pending' // Matches your new schema enum exactly
      };

      const response = await request(app)
        .post('/tasks')
        .send(rawJsonPayload);

      expect(response.statusCode).toBe(201);
      expect(response.body.description).toBe('Implement the POST endpoint'); 
      expect(response.body._id).toBeDefined();
      
      const taskInDb = await Task.findById(response.body._id);
      expect(taskInDb).toBeTruthy();
    });
  });

  describe('2. Testing via Mongoose Models (Database Boundary)', () => {
    it('should successfully save a valid task directly to the database', async () => {
      const taskModel = new Task({
        description: 'Test the Mongoose schema directly',
        assignedTo: validUserId,
        dueDate: new Date('2026-12-31') // Corrected to dueDate
      });

      const savedTask = await taskModel.save();

      expect(savedTask._id).toBeDefined();
      expect(savedTask.description).toBe('Test the Mongoose schema directly');
      expect(savedTask.status).toBe('not started'); // Matches your new schema enum default
    });

    it('should throw a validation error if description is missing', async () => {
      const invalidTaskModel = new Task({
        assignedTo: validUserId
      });

      let error = null;
      try {
        await invalidTaskModel.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).not.toBeNull();
      expect(error.name).toBe('ValidationError');
    });
  });
});