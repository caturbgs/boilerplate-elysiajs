import { t } from "elysia";
import { base64Decode, base64Encode, isJson } from "../helpers/string";
import type { ElysiaGlobalApp } from "../types/elysia";

export default (app: ElysiaGlobalApp) =>
  app
    .post(
      "/encode",
      async ({ body }) => {
        const payload = body.data;

        return {
          success: true,
          message: "Successfully encoded",
          data: base64Encode(typeof payload === "string" ? payload : JSON.stringify(payload)),
        };
      },
      {
        body: t.Object({
          data: t.Union([t.String(), t.Record(t.String(), t.Unknown())]),
        }),
      },
    )
    .post(
      "/decode",
      async ({ body }) => {
        const payload = body.data;
        const decodedData = base64Decode(payload);
        let data: Record<string, unknown> | string;

        if (isJson(decodedData)) {
          data = JSON.parse(decodedData);
        } else {
          data = decodedData;
        }

        return {
          success: true,
          message: "Successfully decoded",
          data: data,
        };
      },
      {
        body: t.Object({
          data: t.String(),
        }),
      },
    );
