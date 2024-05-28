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
};
