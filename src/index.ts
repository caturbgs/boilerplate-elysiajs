import { Elysia } from "elysia";
import config from "./config";
import { corsPlugin } from "./libs/cors";
import cronJob from "./libs/cron";
import { jwtPlugin } from "./libs/jwt";
import { type ObjectLogger, createLoggerInstance, log, loggerPlugin } from "./libs/logger";
import { swaggerPlugin } from "./libs/swagger";
import apiRoutes from "./routes";
import type { IResponse } from "./types/response";

const app = new Elysia()
  // Hooks/Middlewares
  .use(loggerPlugin)
  .use(corsPlugin)
  .use(swaggerPlugin)
  .use(jwtPlugin)
  // using custom error handler
  .onError({ as: "global" }, ({ error, code, request, path, store }) => {
    log.error(error);

    const errorResponse: IResponse = {
      message: error.message,
      status: false,
    };

    if (config.debugMode) {
      errorResponse.stack = error.stack;
    }

    const duration = Date.now() - store.startTime;
    const httpLog = createLoggerInstance("http");
    const objectLogger: ObjectLogger = {
      method: request.method,
      path: path,
      duration: `${duration}ms`,
    };

    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        objectLogger.status = "500";
        httpLog.error(objectLogger, `${request.method} ${request.url} ${objectLogger.status} ${duration}ms`);
        break;
      case "NOT_FOUND":
        objectLogger.status = "404";
        httpLog.warn(objectLogger, `${request.method} ${request.url} ${objectLogger.status} ${duration}ms`);
        break;
      case "VALIDATION":
        // * No need to log error. Already handled by the logger libs.
        break;
      default:
        objectLogger.status = "500";
        httpLog.error(objectLogger, `${request.method} ${request.url} ${objectLogger.status} ${duration}ms`);
        break;
    }

    return errorResponse;
  })
  // Routes
  .use(apiRoutes)
  // Cron
  .use(cronJob)
  // Start the server
  .listen(Bun.env.PORT ?? 3000);

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`);
