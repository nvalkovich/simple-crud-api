import "dotenv/config.js";
import { createServer } from "http";
import getUsers from "./api/getUsers";
import getUserByID from "./api/getUsersById";
import { urlWithIdRegex } from "./utils/constants";
import createUser from "./api/createUser";
import updateUser from "./api/updateUser";
import deleteUser from "./api/deleteUser";

const server = createServer((req, res) => {
  console.log(req.url );
  if (req.url === '/users' && req.method === 'GET') {
    getUsers(res);
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'GET') {
    getUserByID(req, res);
  } else if (req.url === '/users' && req.method === 'POST') {
    createUser(req, res)
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'PUT') {
    updateUser(req, res)
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'DELETE') {
    deleteUser(req, res)
  } else {
    res.writeHead(404, {'Content-Type': 'application-json'});
    res.end(JSON.stringify({'message': 'Endpoint not found'}));
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
