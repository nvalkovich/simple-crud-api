import "dotenv/config.js";
import { createServer } from "http";
import { returnErrorResponse } from "./utils/helpers/api";
import { RepsonseMessages } from "./types/enums";
import routesController from "./api/routes";

const server = createServer((req, res) => {
  try {
    routesController(req, res);
  } catch {
    returnErrorResponse(res, 500, RepsonseMessages.ServerError);
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

export default server;