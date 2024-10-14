import { generateSAFile } from "./src/helpers/file";
import { createLoggerInstance } from "./src/libs/logger";
import { initializeRedis } from "./src/libs/redis";

const moduleLogger = createLoggerInstance("preload");
const isProduction = Bun.env.NODE_ENV === "production";

/**
 * Preload function.
 * Used to run the additional setup after the server is started.
 * An array of scripts/plugins to execute before running a file or script.
 * Reference: {@link https://bun.sh/docs/runtime/bunfig#preload}
 */
moduleLogger.info("Preloading...");
moduleLogger.info("Preloading done.");
