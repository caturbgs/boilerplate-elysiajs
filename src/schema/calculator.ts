import Elysia, { t } from "elysia";

export const calculatorSchema = new Elysia().model({
  "calculator.calculate": t.Object({
    "property-type": t.Enum({
      Industrial: "industrial",
      Business: "business",
      Residential: "residential",
      "Industrial Estate": "industrial estate",
      Public: "public",
      Service: "service",
      "Off-grid": "off-grid",
    }),
    "monthly-bill": t.String(),
  }),
});
