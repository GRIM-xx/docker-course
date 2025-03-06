if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const request = require("supertest");
const { getDateTime, pool } = require("../src/db");
const app = require("../src/index");

jest.mock("../src/db", () => ({
  getDateTime: jest.fn(),
  pool: { end: jest.fn() },
}));

let server; // Store the server instance

beforeAll(() => {
  server = app.listen(); // Start the server for testing
});

afterAll(async () => {
  await pool.end(); // Close the database connection pool
  await new Promise((resolve) => server.close(resolve)); // Ensure the server closes properly
});

describe("API Tests", () => {
  test("GET /ping should return pong", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.text).toBe("pong");
  });

  test("GET / should return current date and time", async () => {
    getDateTime.mockResolvedValue({ now: "2025-02-20T12:00:00.000Z" });

    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ now: "2025-02-20T12:00:00.000Z", api: "node" });
  });

  test("GET / should return 500 on database error", async () => {
    getDateTime.mockResolvedValue(null);

    const res = await request(app).get("/");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch date and time" });
  });
});
