import { IncomingMessage, ServerResponse } from "http";
import { getUsers, getUserByID, createUser, updateUser, deleteUser } from "./operations";
import { urlWithIdRegex } from "../utils/constants";
import { ResponseMessages } from "../types/enums";

const routesController = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    getUsers(res);
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'GET') {
    getUserByID(req, res);
  } else if (req.url === '/api/users' && req.method === 'POST') {
    createUser(req, res)
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'PUT') {
    updateUser(req, res)
  } else if (req.url?.match(urlWithIdRegex) && req.method === 'DELETE') {
    deleteUser(req, res)
  } else {
    res.writeHead(404, {'Content-Type': 'application-json'});
    res.end(JSON.stringify({'message': ResponseMessages.InvalidRoute }));
  }
}

export default routesController;