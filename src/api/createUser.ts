import { User } from "../data/User";
import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4 } from 'uuid';
import { updateData } from "../utils/helpers/data";
import users from "../data/users";
import { checkRequiredFields, returnErrorResponse } from "../utils/helpers/api";
import { RepsonseMessages } from "../types/enums";

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
        returnErrorResponse(res, 400, RepsonseMessages.BodyNotContainRequiredFields);
        return;
      }

      const { username, age, hobbies } = parsedBody;

      const newUser = new User({
        id: uuidv4(),
        username,
        age,
        hobbies
      });

      users.push(newUser);
      await updateData();

      res.writeHead(201, {'Content-Type': 'application-json'});
      res.end(JSON.stringify(newUser));
    })
  } catch {
    returnErrorResponse(res, 500, RepsonseMessages.ServerError);
  }
  
}

export default createUser;