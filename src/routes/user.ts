import type { ElysiaGlobalApp } from "..";
import { authHandlerJwt } from "../libs/auth";
import { jwtPlugin } from "../libs/jwt";
import { userSchema } from "../schema/user";
import { UserService } from "../service/user";

export default (app: ElysiaGlobalApp) =>
  app
    .use(jwtPlugin)
    .use(userSchema)
    .guard(
      {
        // beforeHandle(context) {
        //   return authHandlerJwt(context);
        // },
      },
      (app) =>
        app
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
