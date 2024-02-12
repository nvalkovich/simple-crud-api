import { UserData } from "../types/interfaces";

export class User {
  id: string;
  username: string;
  age: string;
  hobbies: Array<string>;

  constructor({ id, username, age, hobbies, }: UserData) {
  this.id = id;
  this.username = username;
  this.age = age;
  this.hobbies = hobbies;
  }
}