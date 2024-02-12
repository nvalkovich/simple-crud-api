import { IncomingMessage, ServerResponse } from "http";
import { getIDFromUrl, returnErrorResponse, findUserByID } from "../utils/helpers/api";
import { RepsonseMessages } from "../types/enums";
import users from "../data/users";
import { updateData } from "../utils/helpers/data";

const deleteUser = async (req: IncomingMessage, res: ServerResponse) =>  {
  try {
    const id = getIDFromUrl(req);
    if (!id) {
      returnErrorResponse(res, 404, RepsonseMessages.InvalidId);
      return;
    }

    const user = findUserByID(id);
    if (!user) {
      returnErrorResponse(res, 400, RepsonseMessages.UserNotFound);
      return;
    }

    const updatedUsers = users.filter((user) => user.id !== id);
    await updateData(updatedUsers);

    res.writeHead(200, {'Content-Type': 'application-json'});
    res.end(JSON.stringify(updatedUsers));
  } catch {
    returnErrorResponse(res, 500, RepsonseMessages.ServerError);
  }
}

export default deleteUser;