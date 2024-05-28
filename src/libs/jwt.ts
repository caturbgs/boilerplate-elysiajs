import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.SECRET ?? "secret",
      // TODO: adjust schema for jwt payload
      // schema: {
      //   static: ,
      //   params:
      // },
    }),
  )
  .use(bearer());
