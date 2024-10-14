import { UserModel } from "../model/user";

export const UserService = {
  async getAllUsers() {
    await Bun.sleep(3000);

    return UserModel.getAllUsersBQ();
  },
  async getUser(id: string) {
    await Bun.sleep(1000);

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
