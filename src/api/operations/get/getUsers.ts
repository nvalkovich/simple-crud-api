import { ServerResponse } from "http";
import users from "../../../storage/Storage";
import { returnErrorResponse } from "../../../utils/helpers/api";
import { RepsonseMessages } from "../../../types/enums";

const getUsers = async (res: ServerResponse) =>  {
  try {
    res.writeHead(200, {'Content-Type': 'application-json'});
    res.end(JSON.stringify(users.get()));
  } catch {
    returnErrorResponse(res, 500, RepsonseMessages.ServerError);
  }
}

export default getUsers;