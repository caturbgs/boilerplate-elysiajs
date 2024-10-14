import swagger from "@elysiajs/swagger";
import type { versionPlugin } from "./version";

type ElysiaPluginVersion = typeof versionPlugin;

export const swaggerPlugin = (app: ElysiaPluginVersion) =>
  app.use(
    swagger({
      documentation: {
        info: {
          title: "Kratos",
          description: "Open API for Kratos. This is a documentation for Kratos API.",
          version: app.store.version,
        },
      },
    }),
  );
