import { delay } from "../helpers/time";
import { log } from "../libs/logger";
import { CalculatorModel } from "../model/calculator";
import type { PayloadTariffPln } from "../types/calculator";
import type { ElysiaContext } from "../types/elysia";

export const CalculatorService = {
  async getTariffPln(request: ElysiaContext["request"]) {
    await delay(3000);

    return {
      message: "Tariff PLN",
      status: true,
      data: {
        tariff: 1000,
      },
    };
  },
  async calculateTariff(request: ElysiaContext["request"], query: PayloadTariffPln) {
    const data = await CalculatorModel.getStatisticsPLNAll();

    log.info("Data statistics PLN All", data);

    return {
      message: "Tariff PLN",
      status: true,
      // data: {
      //   tariff: 1000,
      // },
      data
    };
  },
};
