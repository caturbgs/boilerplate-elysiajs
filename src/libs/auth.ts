import config from "../config";
import type { ElysiaGlobalContext, ElysiaGlobalContextForHandler } from "../types/elysia";

/**
 * JWT authentication handler.
 * @param {ElysiaGlobalContext} params
 * @param {JWT} params.jwt - JWT instance
 * @param {Function} params.error - Error function
 * @param {string} params.bearer - Bearer token
 * @returns hook function for handling JWT authentication
 */
export const authHandlerJwt = async ({ jwt, error, bearer }: ElysiaGlobalContextForHandler) => {
  const auth = await jwt.verify(bearer);

  if (!auth) {
    return error(401, {
      message: "JWT Unauthorized",
    });
  }
};

/**
 * API key authentication handler for Xurya Calculator.
 * @param {ElysiaGlobalContext} params
 * @param {Object} params.headers - Headers
 * @param {Function} params.error - Error function
 * @returns hook function for handling API key authentication
 */
export const authHandlerApiKeyXuryaCalculator = ({ headers, error }: ElysiaGlobalContextForHandler) => {
  const auth = headers.apikey;

  if (!auth) {
    return error(401, {
      message: "API Key Unauthorized",
    });
  }

  if (config.calculator.apiKey !== auth) {
    return error(401, {
      message: "API Key Unauthorized",
    });
  }
};
