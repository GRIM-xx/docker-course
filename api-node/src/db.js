if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
});

// Handle unexpected errors from idle clients
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(1);
});

// Function to get the current date and time from the database
const getDateTime = async () => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query("SELECT NOW() as now;");
    return res.rows[0];
  } catch (err) {
    console.error("Database query error:", err);
    return null;
  } finally {
    if (client) client.release(); // Ensure client is released back to the pool
  }
};

module.exports = { getDateTime, pool };
