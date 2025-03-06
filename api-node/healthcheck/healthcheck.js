const http = require("http");

const PORT = process.env.PORT || 3000;

const options = {
  timeout: 2000,
  host: "localhost",
  port: PORT,
  path: "/ping",
};

const request = http.request(options, (res) => {
  console.info(`Healthcheck STATUS: ${res.statusCode}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on("error", (err) => {
  console.error("Healthcheck ERROR:", err.message);
  process.exit(1);
});

request.end();
