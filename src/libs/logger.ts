import Elysia from "elysia";
import logixlysia from "logixlysia";
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

const log = pino(transport);

export function createLoggerInstance(module: string) {
  return log.child({ module });
}

export const loggerPlugin = new Elysia().use(
  logixlysia({
    config: {
      showBanner: true,
      useColors: true,
      ip: false,
      customLogFormat: "[{now}] {level}: {method} {pathname} {status} {duration}",
    },
  }),
);
