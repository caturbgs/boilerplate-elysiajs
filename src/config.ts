import { google } from "googleapis";
import { log } from "./libs/logger";

const saFile = Bun.file(Bun.env.SERVICE_ACCOUNT_PATH ?? "./xurya-calculator.json");
const saFileJson = (await saFile.exists()) ? await saFile.json() : {};

export default {
  envMode: Bun.env.NODE_ENV,
  debugMode: (Bun.env.DEBUG ?? false) === "true",
  saEncrypted: Bun.env.XURYA_CALCULATOR_SA,
  saPath: Bun.env.SERVICE_ACCOUNT_PATH ?? "./xurya-calculator.json",
  apiKey: Bun.env.API_KEY ?? "",
  google: {
    authClient: new google.auth.JWT(saFileJson.client_email, undefined, saFileJson.private_key, [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/documents.readonly",
    ]),
  },
  odooUrl: Bun.env.ODOO_URL,
  odooDb: Bun.env.ODOO_DB_NAME,
  odooPort: Bun.env.ODOO_DB_PORT,
  odooUsername: Bun.env.ODOO_XURYABOT_USERNAME,
  odooPassword: Bun.env.ODOO_XURYABOT_PASSWORD,
};

log.info("Config loaded!");
log.info(Bun.env.NODE_ENV);
log.info(Bun.env.SERVICE_ACCOUNT_PATH);
log.info(Bun.env.XURYA_CALCULATOR_SA);
log.info(Bun.env.ODOO_URL);
log.info(Bun.env.ODOO_DB_NAME);
log.info(Bun.env.ODOO_DB_PORT);
log.info(Bun.env.ODOO_XURYABOT_PASSWORD);
log.info(Bun.env.ODOO_XURYABOT_USERNAME);
