import { google } from "googleapis";
import config from "../config";
import { log } from "./logger";

// Type definitions
// export type JWT = InstanceType<typeof google.auth.JWT>;

export const googleApi = {
  async authorize() {
    try {
      const client = config.google.authClient;
      await client.authorize();

      return true;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`Failed to authorize: ${error.message}`);
      }

      return false;
    }
  },
  async createGoogleDriveClient() {
    return google.drive({
      version: "v3",
      auth: config.google.authClient,
    });
  },
  async createGoogleSheetsClient() {
    return google.sheets({
      version: "v4",
      auth: config.google.authClient,
    });
  },
  async getValuesGoogleSheets({
    spreadsheetId,
    range,
  }: {
    spreadsheetId: string;
    range: string;
  }) {
    try {
      const isAuthorized = await this.authorize();

      if (!isAuthorized) {
        throw new Error("Failed to authorize.");
      }

      const gsheetClient = await this.createGoogleSheetsClient();
      const result = await gsheetClient.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      const numRows = result.data.values ? result.data.values.length : 0;
      console.log(`${numRows} rows retrieved.`);
      return result.data.values;
    } catch (error) {
      if (error instanceof Error) {
        log.error(`Failed to get single range values from Google Sheets: ${error.message}`);
      }

      throw error;
    }
  },
};
