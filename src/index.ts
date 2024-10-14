import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import config from "./config";
import { corsPlugin } from "./libs/cors";
import { AUTHENTICATION_ERROR, BAD_REQUEST_ERROR, NOT_FOUND_ERROR } from "./libs/error";
import { jwtPlugin } from "./libs/jwt";
import { createLoggerInstance, loggerPlugin } from "./libs/logger";
import { swaggerPlugin } from "./libs/swagger";
import { versionPlugin } from "./libs/version";
import type { IResponse } from "./types/response";

export const app = new Elysia()
  // Hooks/Middlewares
  .use(loggerPlugin)
  .use(corsPlugin)
  .use(jwtPlugin)
  .use(versionPlugin)
  // using custom error handler
  .error({
    NOT_FOUND_ERROR,
    AUTHENTICATION_ERROR,
    BAD_REQUEST_ERROR,
  })
  .onError({ as: "global" }, ({ error, code, set }) => {
    // Log error
    const errorLog = createLoggerInstance("libs/error");

    // * Define variable for error response
    const errorResponse: IResponse<{ property: string; message: string }[] | { property: string; message: string }> = {
      message: error.message,
      status: false,
      // * Only show stack trace in debug mode
      stack: config.debugMode ? error.stack : undefined,
    };

    switch (code) {
      case "VALIDATION": {
        // custom error response for validation
        // improve readability for validation error
        const validationErrorMessageDetailed = error.all.map((e) => {
          if ("path" in e) {
            return {
              property: e.path.replace("/", ""),
              message: e.message,
            };
          }

          return {
            property: "",
            message: "",
          };
        });
        const validationErrorMessage = {
          property: error.validator.Errors(error.value).First().path.replace("/", ""),
          message: error.validator.Errors(error.value).First().message,
        };
        errorLog.warn(validationErrorMessageDetailed);

        errorResponse.message = "Validation Error";
        // only show detailed error message in debug mode
        errorResponse.data = config.debugMode ? validationErrorMessageDetailed : validationErrorMessage;

        set.status = 400;
        break;
      }
      case "BAD_REQUEST_ERROR":
        // custom error response for bad request
        errorResponse.message = "Bad Request";
        errorLog.warn(error);

        set.status = 400;
        break;
      case "AUTHENTICATION_ERROR":
        // custom error response for authentication error
        errorResponse.message = "Authentication Error";
        errorLog.warn(error);

        set.status = 401;
        break;
      case "NOT_FOUND":
      case "NOT_FOUND_ERROR":
        // custom error response for not found error
        errorResponse.message = "Not Found";
        errorLog.warn(error);

        set.status = 404;
        break;
      case "INTERNAL_SERVER_ERROR":
        // custom error response for internal server error
        errorResponse.message = "Internal Server Error";
        errorLog.error(error);

        set.status = 500;
        break;
      default:
        errorLog.error(error);

        set.status = 500;
        break;
    }

    return errorResponse;
  })
  // Routes
  .use(await autoload())
  .use(swaggerPlugin)
  // Cron
  // .use(cronJob) // Uncomment this line to enable cron job
  // Start the server
  .listen(Bun.env.PORT ?? 3000);
