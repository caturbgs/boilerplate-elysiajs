import cors from "@elysiajs/cors";
import Elysia from "elysia";

export const corsPlugin = new Elysia().use(
  cors({
    origin: "*",
    // TODO: list all the origins frontend URL that can access this API
    // origin: ["http://localhost:3000", "etc.."],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
