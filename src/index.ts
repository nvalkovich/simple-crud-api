import "dotenv/config.js";
import { createServer } from "http";
import getUsers from "./api/getUsers";
import getUserByID from "../1/getUsersByID";
import { urlWithIdRegex } from "./utils/constants";

const server = createServer((req, res) => {
  console.log(req.url );
  if (req.url === '/users' && req.method === 'GET') {
    getUsers(res);
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'GET') {
    getUserByID(req, res);
  } else {
    res.writeHead(404, {'Content-Type': 'application-json'});
    res.end(JSON.stringify({'message': 'Endpoint not found'}));
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
