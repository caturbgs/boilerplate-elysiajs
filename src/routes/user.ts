import { Elysia } from "elysia";
import { jwtPlugin } from "../libs/jwt";
import { userSchema } from "../schema/user";
import { UserService } from "../service/user";

export default new Elysia().group("/user", (app) =>
  app
    .use(jwtPlugin)
    .use(userSchema)
    .onBeforeHandle(async ({ jwt, error, bearer }) => {
      const isAuth = await jwt.verify(bearer);

      if (!isAuth) {
        return error(401, {
          message: "Unauthorized",
          status: false,
        });
      }
    })
    .get("/", async () => {
      return UserService.getAllUsers();
    })
    .get(
      "/:id",
      async ({ params }) => {
        return UserService.getUser(params.id);
      },
      {
        params: "user.id",
      },
    ),
);
