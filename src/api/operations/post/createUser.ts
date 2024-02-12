import { User } from '../../../user/User';
import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4 } from 'uuid';
import users from "../../../storage/Storage";
import { checkRequiredFields, returnErrorResponse } from "../../../utils/helpers/api";
import { ResponseMessages } from "../../../types/enums";

const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    })

    req.on('end', async () => {
      const parsedBody = JSON.parse(body);
      const allRequiredExist = checkRequiredFields(parsedBody);

      if (!allRequiredExist) {
        returnErrorResponse(res, 400, ResponseMessages.BodyNotContainRequiredFields);
        return;
      }

      const { username, age, hobbies } = parsedBody;

      const newUser = new User({
        id: uuidv4(),
        username,
        age,
        hobbies
      });

      users.setNewUser(newUser);

      res.writeHead(201, {'Content-Type': 'application-json'});
      res.end(JSON.stringify(newUser));
    })
  } catch {
    returnErrorResponse(res, 500, ResponseMessages.ServerError);
  }
  
}

export default createUser;