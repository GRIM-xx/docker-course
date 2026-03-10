require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const { getDateTime } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(morgan("tiny"));

// Routes
app.get("/", async (req, res) => {
  try {
    const dateTime = await getDateTime();
    res.json({
      ...dateTime,
      api: "node",
    });
  } catch (err) {
    console.error("Error fetching date and time:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Node API listening on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  console.log(`${signal} received: shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

["SIGTERM", "SIGINT"].forEach((signal) =>
  process.on(signal, () => shutdown(signal))
);

module.exports = { app , server };
