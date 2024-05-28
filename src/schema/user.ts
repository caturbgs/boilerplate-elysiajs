import Elysia, { t } from "elysia";

export const userSchema = new Elysia().model({
  "user.id": t.Object({
    id: t.String({
      format: "uuid",
    }),
  }),
});
