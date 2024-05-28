import Elysia from "elysia";
import pino from "pino";

export interface ObjectLogger {
  method: string;
  path: string;
  status?: number | string;
  duration: number | string;
}

const transport = pino.transport({
  targets: [
    {
      level: "info",
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
    {
      // level: "debug",
      target: "pino/file",
      options: {
        destination: "log/debug.log",
        mkdir: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  ],
});

export const log = pino(transport);

export function createLoggerInstance(module: string) {
  return log.child({ module });
}

export const loggerPlugin = new Elysia()
  .state("startTime", 0)
  .onRequest(({ store }) => {
    store.startTime = Date.now();
  })
  .onResponse({ as: "global" }, ({ request, path, store, set }) => {
    const duration = Date.now() - store.startTime;
    const httpLog = createLoggerInstance("http");
    const statusCode = Number(set.status) ?? 200;
    const objectLogger: ObjectLogger = {
      method: request.method,
      path: path,
      status: statusCode,
      duration: `${duration}ms`,
    };

    const message = `${request.method} ${request.url} ${statusCode} ${duration}ms`;

    if (statusCode >= 500) {
      httpLog.error(objectLogger, message);
    } else if (statusCode >= 400) {
      httpLog.warn(objectLogger, message);
    } else {
      httpLog.info(objectLogger, message);
    }
  });
