export const UserModel = {
  async getAllUsersBQ() {
    return {
      message: "Success get all users",
      data: [
        {
          id: 1,
          name: "John Doe",
          email: "john",
        },
      ],
    };
  },
};
