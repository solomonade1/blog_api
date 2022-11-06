const http = require("http");
require("dotenv").config();
const app = require("./app");

PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`app is lisnening on http://localhost:${PORT}`);
});
