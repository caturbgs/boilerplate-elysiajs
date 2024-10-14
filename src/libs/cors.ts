import cors from "@elysiajs/cors";
import Elysia from "elysia";

export const corsPlugin = new Elysia().use(
  cors({
    // origin: ["http://localhost:3100", /^https?:\/\/([a-z0-9]+\.)*xurya\.com$/],
    origin: ["http://localhost:3100", /^https:\/\/([a-zA-Z0-9-]+\.)?xurya\.com(\/.*)?$/],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "apikey"],
  }),
);
