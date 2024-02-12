import { IncomingMessage, ServerResponse } from "http";
import { uuidRegex } from "../constants";
import users from "../../data/users";

export const getIDFromUrl = (req: IncomingMessage ) => {
  return req.url?.match(uuidRegex)?.join('');
}

export const findUserByID = (id: string ) => {
  return users.find((user) => user.id === id);
}

export const checkRequiredFields = (data: {[key: string]: string}) => {
  return data.username && data.age && data.hobbies;
}

export const returnErrorResponse = (res: ServerResponse, statusCode: number, message: string) => {
  res.writeHead(statusCode, {'Content-Type': 'application-json'});
  res.end(JSON.stringify({'message': `${message}`}));
}