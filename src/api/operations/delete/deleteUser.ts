import { IncomingMessage, ServerResponse } from "http";
import { getIDFromUrl, returnErrorResponse } from "../../../utils/helpers/api";
import { ResponseMessages } from "../../../types/enums";
import users from "../../../storage/Storage";

const deleteUser = async (req: IncomingMessage, res: ServerResponse) =>  {
  try {
    const id = getIDFromUrl(req);
    if (!id) {
      returnErrorResponse(res, 404, ResponseMessages.InvalidId);
      return;
    }

    const user = users.getByID(id);
    if (!user) {
      returnErrorResponse(res, 400, ResponseMessages.UserNotFound);
      return;
    }

    users.deleteUser(id);

    const currentUsers = users.get();

    res.writeHead(204, {'Content-Type': 'application-json'});
    res.end(JSON.stringify(currentUsers));
  } catch {
    returnErrorResponse(res, 500, ResponseMessages.ServerError);
  }
}

export default deleteUser;