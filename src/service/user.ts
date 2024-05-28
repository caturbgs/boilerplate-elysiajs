import { delay } from "../helpers/time";
import { UserModel } from "../model/user";

export const UserService = {
  async getAllUsers() {
    await delay(3000);

    return UserModel.getAllUsersBQ();
  },
  async getUser(id: string) {
    await delay(1000);

    return {
      message: "Success get user by id",
      data: {
        id: 1,
        name: "John Doe",
        email: "john",
      },
    };
  },
};
