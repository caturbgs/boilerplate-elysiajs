import config from "../config";
import type { ElysiaContext } from "../types/elysia";

export const authHandlerJwt = async ({ jwt, error, bearer }: ElysiaContext) => {
  const auth = await jwt.verify(bearer);

  if (!auth) {
    return error(401, {
      message: "JWT Unauthorized",
    });
  }
};

export const authHandlerApiKey = async ({ headers, error }: ElysiaContext) => {
  const auth = headers.apikey;

  if (!auth) {
    return error(401, {
      message: "API Key Unauthorized",
    });
  }

  if (config.apiKey !== auth) {
    return error(401, {
      message: "API Key Unauthorized",
    });
  }
};
