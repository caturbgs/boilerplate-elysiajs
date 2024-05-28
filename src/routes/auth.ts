import { Elysia } from "elysia";
import { jwtPlugin } from "../libs/jwt";
import { authSchema } from "../schema/auth";

export default new Elysia().group("/auth", (app) =>
  app
    .use(jwtPlugin)
    .use(authSchema)
    .get(
      "/profile",
      async ({ jwt, bearer }) => {
        const profile = await jwt.verify(bearer);

        return {
          message: "Profile",
          status: true,
          data: {
            profile,
          },
        };
      },
      {
        beforeHandle: async ({ jwt, error, bearer }) => {
          const isAuth = await jwt.verify(bearer);

          if (!isAuth) {
            return error(401, {
              message: "Unauthorized",
              status: false,
            });
          }
        },
      },
    )
    .post(
      "/signin",
      async ({ jwt, cookie: { auth }, body }) => {
        const { username, password } = body;
        const token = await jwt.sign({ username, password });

        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 60 * 60 * 9,
          path: "/",
        });

        return {
          message: "Sign in success",
          status: true,
          data: {
            token,
          },
        };
      },
      {
        body: "auth.sign-in",
      },
    ),
);
