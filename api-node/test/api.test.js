const request = require("supertest");
const { app, server } = require("../src/index");

// Mock database function so tests do not use real DB
jest.mock("../src/db", () => ({
  getDateTime: jest.fn().mockResolvedValue({ now: "2025-01-01T00:00:00Z" }),
}));

describe("API Tests", () => {
  test("GET /ping → should return 'pong'", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.text).toBe("pong");
  });

  test("GET / → should return datetime JSON", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("now");
    expect(res.body).toHaveProperty("api", "node");
  });

  afterAll((done) => {
    server.close(done); // Close the server after tests
  });
});
