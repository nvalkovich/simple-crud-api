import { ServerResponse } from "http";
import users from "../../../storage/Storage";
import { returnErrorResponse } from "../../../utils/helpers/api";
import { ResponseMessages } from "../../../types/enums";

const getUsers = async (res: ServerResponse) =>  {
  try {
    const currentUsers = users.get();
    res.writeHead(200, {'Content-Type': 'application-json'});
    res.end(JSON.stringify(currentUsers));
  } catch {
    returnErrorResponse(res, 500, ResponseMessages.ServerError);
  }
}

export default getUsers;