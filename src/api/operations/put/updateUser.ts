import { IncomingMessage, ServerResponse } from "http";
import users from "../../../storage/Storage";
import { RepsonseMessages } from "../../../types/enums";
import { getIDFromUrl,  returnErrorResponse } from "../../../utils/helpers/api";

const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const id = getIDFromUrl(req);
    if (!id) {
      returnErrorResponse(res, 404, RepsonseMessages.InvalidId);
      return;
    }

    const user = users.getByID(id);
    if (!user) {
      returnErrorResponse(res, 400, RepsonseMessages.UserNotFound);
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    })

    req.on('end', async () => {
      const parsedBody = JSON.parse(body);
      const {username, age, hobbies } = parsedBody;

      const updatedUser = {
        id,
        username: username || user.username,
        age: age || user.age,
        hobbies: hobbies || user.hobbies,
      };

      users.updateUser(updatedUser);

      res.writeHead(201, {'Content-Type': 'application-json'});
      res.end(JSON.stringify(updatedUser)); 
    })
  } catch {
    returnErrorResponse(res, 500, RepsonseMessages.ServerError);
  }
  
}

export default updateUser;