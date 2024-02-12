
import { createServer } from "http";
import { returnErrorResponse } from "../utils/helpers/api";
import routesController from "../api/routes";
import { ResponseMessages } from "../types/enums";

export class AppServer {
  createServer() {
    const server = createServer((req, res) => {
      try {
        routesController(req, res);
      } catch {
        returnErrorResponse(res, 500, ResponseMessages.ServerError);
      }
    });
    
    const PORT = process.env.PORT || 4000;
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })

    return server;
  }
}