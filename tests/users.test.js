import request from "supertest";
import app from "../src/app.js";
import { connectDB, disconnectDB, clearDB } from "./db.js";
import User from "../src/models/user.model.js";

// Manage the isolated database lifecycle
beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe("User API Endpoints", () => {
  const validUserPayload = {
    email: "test@example.com",
    password: "securepassword123",
    displayName: "Test User"
  };

  it("should successfully create a new user via POST /users", async () => {
    const response = await request(app)
      .post("/users")
      .send(validUserPayload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("email", "test@example.com");
    expect(response.body).toHaveProperty("displayName", "Test User");
    
    // Security check: The API should never return the password in the response
    expect(response.body).not.toHaveProperty("password");
  });

  it("should return 400 Bad Request if required fields are missing", async () => {
    const invalidUserPayload = {
      email: "incomplete@example.com"
      // Missing password and displayName
    };

    const response = await request(app)
      .post("/users")
      .send(invalidUserPayload);

    expect(response.status).toBe(400);
  });

  it("should return 400 Bad Request if the email already exists", async () => {
    // Seed the database with the first user
    await User.create(validUserPayload);

    // Attempt to register a second user with the exact same email
    const response = await request(app)
      .post("/users")
      .send({
        email: "test@example.com",
        password: "differentpassword456",
        displayName: "Another User"
      });

    expect(response.status).toBe(400);
  });
});