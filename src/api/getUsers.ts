import { ServerResponse } from "http";
import users from "../storage/users";

const getUsers = async (res: ServerResponse) =>  {
  try {
    res.writeHead(200, {'Content-Type': 'application-json'});
    res.end(JSON.stringify(users));
  } catch (e) {
    console.log(e);
  }
}

export default getUsers;