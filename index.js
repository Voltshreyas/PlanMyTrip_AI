// index.js
console.log("Hello from Node.js!");

const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World from my Node.js server!");
});
server.listen(3000, () => console.log("Server running at http://localhost:3000"));
