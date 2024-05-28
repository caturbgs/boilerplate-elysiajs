import Elysia, { t } from "elysia";

export const authSchema = new Elysia().model({
  "auth.sign-in": t.Object({
    username: t.String(),
    password: t.String(),
  }),
});
