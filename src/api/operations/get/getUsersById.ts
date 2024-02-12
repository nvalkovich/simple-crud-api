import { IncomingMessage, ServerResponse } from "http";
import { getIDFromUrl, returnErrorResponse } from "../../../utils/helpers/api";
import { ResponseMessages } from "../../../types/enums";
import users from "../../../storage/Storage";

const getUserByID = async (req: IncomingMessage, res: ServerResponse) =>  {
  try {
    const id = getIDFromUrl(req);
    if (!id) {
      returnErrorResponse(res, 400, ResponseMessages.InvalidId);
      return;
    }

    const user = users.getByID(id);
    if (!user) {
      returnErrorResponse(res, 404, ResponseMessages.UserNotFound);
      return;
    }

    res.writeHead(200, {'Content-Type': 'application-json'});
    res.end(JSON.stringify(user));
  } catch (e) {
    returnErrorResponse(res, 500, ResponseMessages.ServerError);
  }
}

export default getUserByID;