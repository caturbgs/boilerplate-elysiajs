import { Elysia } from "elysia";
import { authHandlerApiKey, authHandlerJwt } from "../libs/auth";
import { jwtPlugin } from "../libs/jwt";
import { calculatorSchema } from "../schema/calculator";
import { CalculatorService } from "../service/calculator";

export default new Elysia().group("/calculator", (app) =>
  app
    .use(jwtPlugin)
    .use(calculatorSchema)
    .onBeforeHandle(authHandlerJwt)
    .onBeforeHandle(authHandlerApiKey)
    .get("/tariff-pln", async ({ request }) => {
      return CalculatorService.getTariffPln(request);
    })
    .get(
      "/tariff-calc",
      async ({ request, query }) => {
        return CalculatorService.calculateTariff(request, query);
      },
      {
        query: "calculator.calculate",
      },
    ),
);
