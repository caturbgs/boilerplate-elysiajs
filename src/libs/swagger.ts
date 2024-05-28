import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

export const swaggerPlugin = new Elysia().state("version", Bun.env.VERSION ?? "0.0.1").use(
  swagger({
    documentation: {
      info: {
        title: "Bun Gateway",
        description: "Bun Gateway API",
        version: Bun.env.VERSION ?? "0.0.1",
      },
    },
  }),
);
