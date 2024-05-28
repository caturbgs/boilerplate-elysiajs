import { log } from "./libs/logger";

export default {
  envMode: Bun.env.NODE_ENV,
  debugMode: (Bun.env.DEBUG ?? false) === "true",
  apiKey: Bun.env.API_KEY ?? "",
};

log.info("Config loaded!");
log.info(Bun.env.NODE_ENV);
log.info(Bun.env.API_KEY);
