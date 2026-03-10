const fs = require('fs');

const { Pool } = require('pg');

let databaseUrl;

if (process.env.DATABASE_URL) {
  databaseUrl = process.env.DATABASE_URL;
} else if (process.env.DATABASE_URL_FILE) {
  databaseUrl = fs.readFileSync(process.env.DATABASE_URL_FILE, "utf8").trim();
} else {
  throw new Error("DATABASE_URL or DATABASE_URL_FILE must be set.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client:", err);
  process.exit(1);
});

const getDateTime = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT NOW() AS now");
    return result.rows[0];
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  getDateTime,
};