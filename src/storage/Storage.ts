import { UserData } from "../types/interfaces";

class UsersStorage {
  private data: UserData[];

  constructor(data: UserData[]) {
    this.data = data;
  }

  get() {
    return this.data;
  }

  getByID(id: string) {
    return this.data.find((user) => user.id === id);
  }

  setNewUser(user: UserData) {
    this.data.push(user);
  }

  set(users: UserData[]) {
    this.data = users;
  }

  deleteUser(id: string) {
    this.data = this.data.filter((user) => user.id !== id)
  }

  updateUser(updatedUser: UserData) {
    const updatedData = this.data.map(
      user => user.id === updatedUser.id ? updatedUser : user
    );
    this.data = updatedData;
  }
}


const users = new UsersStorage([]);

export default users; 




