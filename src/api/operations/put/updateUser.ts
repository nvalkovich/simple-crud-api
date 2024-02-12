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
      let parsedBody;
  
      try {
        parsedBody = JSON.parse(body);
        if (parsedBody.age || parsedBody.hobbies) {
          if (typeof JSON.parse(parsedBody.age) !== 'number' 
          || !Array.isArray(parsedBody.hobbies)) {
            returnErrorResponse(res, 400, ResponseMessages.InvalidBodyTypes);
            return;
          }
        }
      } catch {
        returnErrorResponse(res, 400, ResponseMessages.InvalidBody);
        return;
      }
      
      const {username, age, hobbies, ...rest} = parsedBody;

      if (Object.keys(rest).length) {
        returnErrorResponse(res, 400, ResponseMessages.InvalidBodyFields);
        return;
      }

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