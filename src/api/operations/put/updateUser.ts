import { IncomingMessage, ServerResponse } from "http";
import users from "../../../storage/Storage";
import { ResponseMessages } from "../../../types/enums";
import { getIDFromUrl,  returnErrorResponse } from "../../../utils/helpers/api";
import { User } from "../../../user/User";

const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
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

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    })

    req.on('end', async () => {
      const parsedBody = JSON.parse(body);
      const {username, age, hobbies } = parsedBody;

      const updatedUser = new User({
        id,
        username: username || user.username,
        age: age || user.age,
        hobbies: hobbies || user.hobbies,
      });

      users.updateUser(updatedUser);

      res.writeHead(200, {'Content-Type': 'application-json'});
      res.end(JSON.stringify(updatedUser)); 
    })
  } catch {
    returnErrorResponse(res, 500, ResponseMessages.ServerError);
  }
  
}

export default updateUser;