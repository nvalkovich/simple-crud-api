import { writeFile } from "node:fs/promises";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'node:path';
import users from "../../data/users";
import { UserData } from "../../types/interfaces";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToData = "../../data/users.ts";
const path = resolve(__dirname, pathToData);

export const updateData = async (usersList: UserData[] = users) => { 
  await writeFile(path, `const users = ${JSON.stringify(usersList, null, 2)}; \n\nexport default users;`);
} 
