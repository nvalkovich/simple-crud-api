import { IncomingMessage, ServerResponse } from "http";
import { uuidRegex } from "../constants";

export const getIDFromUrl = (req: IncomingMessage ) => {
  return req.url?.match(uuidRegex)?.join('');
}

export const checkRequiredFields = (data: {[key: string]: string}) => {
  return data.username && data.age && data.hobbies;
}

export const returnErrorResponse = (res: ServerResponse, statusCode: number, message: string) => {
  res.writeHead(statusCode, {'Content-Type': 'application-json'});
  res.end(JSON.stringify({'message': `${message}`}));
}