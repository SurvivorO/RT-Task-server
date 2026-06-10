import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import { connectDB, disconnectDB, clearDB } from "./db.js";

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe("Task API Security and Authentication", () => {
  let authCookie;
  let testUserId; // We need this to satisfy the required 'assignedTo' field

  beforeEach(async () => {
    // FIX 1: Pass plaintext password. Your Mongoose pre("save") hook handles the hash.
    const user = await User.create({
      email: "test@dev.com",
      password: "password123",
      displayName: "testdev"
    });

    // Save the generated user ID to use in our task payload later
    testUserId = user._id;

    // Simulate a login request to get the token cookie
    const loginResponse = await request(app)
      .post("/users/login")
      .send({ email: "test@dev.com", password: "password123" });

    // Extract the cookie array from the response headers
    authCookie = loginResponse.headers["set-cookie"];
  });

  it("should return 401/403 if no authentication cookie is provided", async () => {
    // Making a request WITHOUT attaching the authCookie
    const response = await request(app).post("/tasks").send({
      description: "Unauthenticated task attempt", // FIX 2: Match your schema
      assignedTo: testUserId,                      // FIX 3: Required by your schema
      status: "pending"
    });

    // Asserts that the auth middleware successfully blocks the request
    expect(response.status).toBeGreaterThanOrEqual(401);
    expect(response.status).toBeLessThanOrEqual(403);
  });

  it("should allow access and create a task when a valid cookie is provided", async () => {
    // Making a request WITH the authCookie manually injected
    const response = await request(app)
      .post("/tasks")
      .set("Cookie", authCookie)
      .send({
        description: "Authenticated task attempt",
        assignedTo: testUserId,
        status: "pending"
      });

    // Asserts the request bypassed the auth middleware and successfully hit the task controller
    expect(response.status).toBe(201);
  });
});