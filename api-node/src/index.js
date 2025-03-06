if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const morgan = require("morgan");
const { getDateTime, pool } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));

app.get("/", async (req, res) => {
  const dateTime = await getDateTime();

  if (!dateTime) {
    return res.status(500).json({ error: "Failed to fetch date and time" });
  }

  res.json({ ...dateTime, api: "node" });
});

app.get("/ping", (_, res) => {
  res.send("pong");
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("SIGTERM", async () => {
    console.debug("SIGTERM signal received: closing HTTP server");

    server.close(async () => {
      console.debug("HTTP server closed");

      try {
        await pool.end(); // Close database connection pool
        console.debug("Database pool closed");
        process.exit(0);
      } catch (err) {
        console.error("Error closing database pool:", err);
        process.exit(1);
      }
    });
  });
}

module.exports = app;
