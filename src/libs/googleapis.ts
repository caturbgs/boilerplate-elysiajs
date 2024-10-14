import { BigQuery, type TableMetadata } from "@google-cloud/bigquery";
import { Storage } from "@google-cloud/storage";
import { drive } from "@googleapis/drive";
import { sheets } from "@googleapis/sheets";
import config from "../config";
import { generateJWT } from "../helpers/file";
import { executeWithRetry } from "../helpers/time";
import type { Auth, Credentials, ValuesRangeGoogleSheets } from "../types/googleapis";
import { BAD_REQUEST_ERROR, NOT_FOUND_ERROR } from "./error";
import { createLoggerInstance } from "./logger";
import { deleteCacheRedis, getCacheRedis, setCacheRedis } from "./redis";

const moduleLogger = createLoggerInstance("libs/googleapis");

export const googleApis = {
  /**
   * Authorize Google API.
   * This function will authorize Google API using JWT.
   * Using JWT for get the credentials (access token, refresh token, expiry date, etc).
   * Return the credentials and JWT.
   * @param module - Module name. Based on available modules in config. E.g. "calculator", "onm-suite"
   * @returns Authorization object
   * */
  async authorize(module: "calculator" | "onm-suite"): Promise<Auth> {
    try {
      const jwt = await generateJWT(module);
      const credentials = await jwt.authorize();

      return {
        jwt,
        credentials,
      };
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(error, "Failed to authorize.");
      }

      throw error;
    }
  },
  /**
   * Authorize Google API with Redis.
   * This function will authorize Google API using JWT.
   * Using JWT for get the credentials (access token, refresh token, expiry date, etc).
   * The difference with authorize function is this function will use Redis for caching for storing the credentials.
   * Return the credentials and JWT.
   * @param module - Module name. Based on available modules in config. E.g. "calculator", "onm-suite"
   * @returns Authorization object
   * */
  async authorizeWithRedis(module: "calculator" | "onm-suite"): Promise<Auth> {
    if (config.envMode === "production") {
      throw new Error("This function is not allowed in production environment.");
    }

    try {
      const jwt = await generateJWT(module);
      const key = `googleapis:${module}:credentials`;

      const cachedResults = await getCacheRedis<Credentials>(key);
      if (cachedResults) {
        moduleLogger.info(`authorizeWithRedis: Cached hit ==> ${key}`);
        return { jwt, credentials: cachedResults };
      }

      moduleLogger.info(`authorizeWithRedis: Cached miss ==> ${key}`);
      moduleLogger.info("authorizeWithRedis: Fetching data from data source");

      const credentials = await jwt.authorize();
      if (!credentials.expiry_date) {
        throw new Error("Expiry date is not provided.");
      }

      const ttl = Math.floor((credentials.expiry_date - Date.now()) / 1000);

      moduleLogger.info(`Setting cache value ==> ${key}`);
      await setCacheRedis(key, credentials, ttl);

      return {
        jwt,
        credentials,
      };
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(error, "Failed to authorize.");
      }

      await deleteCacheRedis(`googleapis:${module}:credentials`);

      return await executeWithRetry(() => this.authorize(module), 3, 1000);
    }
  },
  /**
   * Create a Google Drive client.
   * @returns Google Drive client
   */
  async createGoogleDriveClient() {
    const { jwt } = await this.authorize("calculator");

    return drive({
      version: "v3",
      auth: jwt,
    });
  },
  /**
   * Create a Google Sheets client.
   * @returns Google Sheets client
   */
  async createGoogleSheetsClient() {
    const { jwt } = await this.authorize("calculator");

    return sheets({
      version: "v4",
      auth: jwt,
    });
  },

  /**
   * Create a Google BigQuery client.
   * @param projectId - Project ID
   * @param [location] - Location. Default to config["onm-suite"].google.bigquery.location
   * @returns Google BigQuery client
   * */
  async createGoogleBigQueryClient(projectId: string, location = config["onm-suite"].google.bigquery.location) {
    const { jwt } = await this.authorize("onm-suite");

    return new BigQuery({
      authClient: jwt,
      projectId,
      location,
    });
  },
  async createGoogleCloudStorageClient() {
    const { jwt } = await this.authorize("onm-suite");

    return new Storage({
      authClient: jwt,
    });
  },
  // * Google Sheets
  /**
   * Get values from a single range in Google Sheets.
   * @param {Object} params - Parameters
   * @param {string} params.spreadsheetId - Spreadsheet ID
   * @param {string} params.range - Range
   * @param {string} [params.directions] - Directions
   * @returns Cell values
   */
  async getValuesGoogleSheets({
    spreadsheetId,
    range,
    directions = "ROWS",
  }: {
    spreadsheetId: string;
    range: string;
    directions?: "ROWS" | "COLUMNS";
  }) {
    try {
      const gsheetClient = await this.createGoogleSheetsClient();
      const result = await gsheetClient.spreadsheets.values.get({
        spreadsheetId,
        range,
        majorDimension: directions,
      });
      const numRows = result.data.values ? result.data.values.length : 0;
      moduleLogger.warn(`${numRows} rows retrieved.`);
      return result.data.values;
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(`Failed to get single range values from Google Sheets: ${error.message}`);
      }

      throw error;
    }
  },
  /**
   * Batch get values from Google Sheets.
   * @param {Object} params - Parameters
   * @param {string} params.spreadsheetId - Spreadsheet ID
   * @param {string[]} params.ranges - Ranges
   * @param {string} [params.directions] - Directions
   * @returns Cell values
   * */
  async batchGetValuesGoogleSheets({
    spreadsheetId,
    ranges,
    directions = "ROWS",
  }: {
    spreadsheetId: string;
    ranges: string[];
    directions?: "ROWS" | "COLUMNS";
  }) {
    try {
      const gsheetClient = await this.createGoogleSheetsClient();
      const result = await gsheetClient.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
        majorDimension: directions,
      });

      // add check if data is not found
      const rowsFetched = result.data.valueRanges;
      if (!rowsFetched) throw new NOT_FOUND_ERROR("Data not found");

      const numRows = rowsFetched.length;
      moduleLogger.warn(`${numRows} rows retrieved.`);
      return rowsFetched.map((row) => row.values);
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(`Failed to batch get values from Google Sheets: ${error.message}`);
      }

      throw error;
    }
  },
  /**
   * Update values in Google Sheets.
   * @param {Object} params
   * @param {string} params.spreadsheetId - Spreadsheet ID
   * @param {string} params.range - Range
   * @param {string[][]} params.values - Values to update
   * @returns Update result
   */
  async updateValuesGoogleSheets({
    spreadsheetId,
    range,
    values,
  }: {
    spreadsheetId: string;
    range: string;
    values: string[][];
  }) {
    try {
      const gsheetClient = await this.createGoogleSheetsClient();
      const result = await gsheetClient.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: {
          values,
        },
      });
      moduleLogger.warn(`Updated ${result.data.updatedCells} cells.`);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(`Failed to update values in Google Sheets: ${error.message}`);
      }

      throw error;
    }
  },
  /**
   * Batch update values in Google Sheets.
   * @param {Object} params
   * @param {string} params.spreadsheetId - Spreadsheet ID
   * @param {ValuesRangeGoogleSheets[]} params.data - Data to update. Each element in the array is a ValueRange object. Including the range and values to update.
   * @returns Update result
   */
  async batchUpdateValuesGoogleSheets({
    spreadsheetId,
    data,
  }: {
    spreadsheetId: string;
    data: ValuesRangeGoogleSheets[];
  }) {
    try {
      const gsheetClient = await this.createGoogleSheetsClient();
      const result = await gsheetClient.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: "RAW",
          data: data,
        },
      });
      moduleLogger.warn(`Updated ${result.data.totalUpdatedCells} cells.`);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(`Failed to batch update values in Google Sheets: ${error.message}`);
      }

      throw error;
    }
  },
  /**
   * Append values to Google Sheets.
   * Use this method to append values to a range in Google Sheets.
   * @param {Object} params
   * @param {string} params.spreadsheetId - Spreadsheet ID
   * @param {string} params.range - The input range is used to search for existing data and find a "table" within that range.
   * @param {ValuesRangeGoogleSheets["values"]} params.values - Values to append
   * @returns Append result
   */
  async appendValuesGoogleSheets({
    spreadsheetId,
    range,
    values,
  }: {
    spreadsheetId: string;
    range: string;
    values: ValuesRangeGoogleSheets["values"];
  }) {
    try {
      const gsheetClient = await this.createGoogleSheetsClient();
      const result = await gsheetClient.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values,
        },
      });
      const numCells = result.data.updates ? result.data.updates.updatedCells : 0;
      moduleLogger.warn(`Appended ${numCells} cells.`);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        moduleLogger.error(`Failed to append values in Google Sheets: ${error.message}`);
      }

      throw error;
    }
  },
  // * Google BigQuery
  /**
   * Generate a query for Google BigQuery.
   * @param {Object} params
   * @param {string} [params.column="*"] - Column. Default to "*"
   * @param {string} params.project - Project
   * @param {string} params.dataset - Dataset
   * @param {string} params.tableOrView - Table or view
   * @param {string} [params.additional=""] - Additional query
   * @returns Query
   * */
  gbqGenerateQuery({
    column = "*",
    project,
    dataset,
    tableOrView,
    additional = "",
  }: { column?: string; project: string; dataset: string; tableOrView: string; additional?: string }) {
    const query = `SELECT ${column} FROM \`${project}.${dataset}.${tableOrView}\` ${additional}`;

    moduleLogger.info(`gbqGenerateQuery Generated Query: ${query}`);

    return query;
  },
  /**
   * Generate a query to check if a table exists in Google BigQuery.
   * @param {Object} params
   * @param {string} params.project - Project
   * @param {string} params.dataset - Dataset
   * @param {string} params.tableId - Table ID
   * @returns Query
   * */
  gbqCheckTableQuery({ project, dataset, tableId }: { project: string; dataset: string; tableId: string }) {
    const query = `SELECT count(*) AS TOTALNUMBEROFTABLES FROM \`${project}.${dataset}.__TABLES_SUMMARY__\` WHERE table_id = '${tableId}'`;

    moduleLogger.info(`gbqCheckTableQuery Generated Query: ${query}`);
    return query;
  },
  /**
   * Read query from Google BigQuery.
   * @param {Object} params
   * @param {string} params.query - Query
   * @param {string} params.projectId - Project ID
   * @returns Query result
   * */
  async gbqReadQuery<T = unknown>({ query, projectId }: { query: string; projectId: string }): Promise<T[]> {
    const bigqueryClient = await this.createGoogleBigQueryClient(projectId);

    // Run the query as a job
    const [job] = await bigqueryClient.createQueryJob({ query });
    moduleLogger.info("Get data from GBQ...");

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    return rows as unknown as T[];
  },

  /**
   * Create a table in Google BigQuery.
   * @param {Object} params
   * @param {string} [params.location=config["onm-suite"].google.bigquery.location] - Location
   * @param {string} params.datasetId - Dataset ID
   * @param {string} params.tableId - Table ID
   * @param {string} params.projectId - Project ID
   * @returns Table reference
   * */
  async gbqCreateTableQuery({
    location = config["onm-suite"].google.bigquery.location,
    datasetId,
    tableId,
    projectId,
  }: { location?: string; datasetId: string; tableId: string; projectId: string }) {
    const options: TableMetadata = {
      schema: [
        {
          name: "oid",
          type: "STRING",
          mode: "REQUIRED",
          description: "oid details",
        },
        {
          name: "plts_id",
          type: "INTEGER",
          mode: "REQUIRED",
          description: "plts id details",
        },
        {
          name: "first_start_time",
          type: "DATETIME",
          mode: "REQUIRED",
          description: "first start time details",
        },
        {
          name: "last_restored_time",
          type: "DATETIME",
          mode: "REQUIRED",
          description: "last restored time details",
        },
        {
          name: "created_date",
          type: "DATETIME",
          mode: "REQUIRED",
          description: "created date details",
        },
        {
          name: "modified_by",
          type: "STRING",
          mode: "REQUIRED",
          description: "modified by details",
        },
        {
          name: "action_id",
          type: "INTEGER",
          mode: "REQUIRED",
          description: "action id details",
        },
      ],
      location: location,
    };
    const bigqueryClient = await this.createGoogleBigQueryClient(projectId);

    moduleLogger.warn(`Creating table ${tableId} in dataset ${datasetId}...`);

    const [job] = await bigqueryClient.dataset(datasetId).createTable(tableId, options);

    moduleLogger.info(`${tableId} was successfully created!`);

    return [{ job }];
  },
  /**
   * Stream insert rows into Google BigQuery.
   * @param {Object} params
   * @param {string} params.projectId - Project ID
   * @param {string} params.datasetId - Dataset ID
   * @param {string} params.tableId - Table ID
   * @param {RowsBigQuery[]} params.rows - Rows to insert
   * @returns Job kind
   * */
  async gbqStreamInsert({
    projectId,
    datasetId,
    tableId,
    rows,
  }: { projectId: string; datasetId: string; tableId: string; rows: unknown }) {
    const bigqueryClient = await this.createGoogleBigQueryClient(projectId);

    // dynamic logger based on array or else
    if (Array.isArray(rows)) {
      moduleLogger.warn(`Inserting ${rows.length} rows into ${tableId} in dataset ${datasetId}...`);
    } else {
      moduleLogger.warn(`Inserting 1 row into ${tableId} in dataset ${datasetId}...`);
    }

    const [job] = await bigqueryClient.dataset(datasetId).table(tableId).insert(rows);

    if (Array.isArray(rows)) {
      moduleLogger.info(`${rows.length} rows successfully inserted into ${tableId} in dataset ${datasetId}!`);
    } else {
      moduleLogger.info(`1 row successfully inserted into ${tableId} in dataset ${datasetId}!`);
    }

    return [{ job }];
  },
};
