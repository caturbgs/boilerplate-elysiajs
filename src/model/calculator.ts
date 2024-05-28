import { googleApi } from "../libs/googleapi";
import type { PayloadTariffPln } from "../types/calculator";

export const CalculatorModel = {
  async getEstimationTariffConsumption({
    propertyType,
    monthlyBill,
    tariffType,
    tariff,
  }: {
    propertyType: PayloadTariffPln["property-type"];
    monthlyBill: PayloadTariffPln["monthly-bill"];
    tariffType?: string;
    tariff?: number;
  }) {
    return {
      message: "Tariff PLN",
      status: true,
      data: {
        tariff: 1000,
      },
    };
  },
  async getStatisticsPLNAll() {
    const pvSiteEstimatorGsheet = await googleApi.getValuesGoogleSheets({
      spreadsheetId: "1OXY0UzsP9lWJ_IkO5GoNhEd34-SSws_Bu0gMIp_e2KM",
      range: "PLN_Statistics!A1:K20",
    });

    return pvSiteEstimatorGsheet;
  },
};
