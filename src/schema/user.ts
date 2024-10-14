import Elysia, { t } from "elysia";

const userId = t.Object({
  id: t.String({
    format: "uuid",
  }),
});

export const userSchema = new Elysia().model({
  "user.id": userId,
});

export type UserId = typeof userId.static;
