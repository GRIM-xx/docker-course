const http = require("http");

const PORT = process.env.PORT || 3000;

const options = {
  host: "localhost",
  port: PORT,
  path: "/ping",
  timeout: 2000,
};

const req = http.request(options, (res) => {
  console.log("STATUS:", res.statusCode);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on("error", (err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});

req.end();
