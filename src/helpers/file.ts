import { auth } from "@googleapis/sheets";
import config from "../config";
import { createLoggerInstance } from "../libs/logger";
import { base64Decode } from "./string";

const moduleLogger = createLoggerInstance("helpers/file");

/**
 * Generate service account file from environment variable.
 * If production, generate production SA file. Otherwise, generate development SA file.
 * @param module - Module name. Based on available modules in config. E.g. "calculator", "onm-suite"
 * @returns string path to service account file
 */
export async function generateSAFile(module: "calculator" | "onm-suite") {
  try {
    moduleLogger.info(`Generating SA file for module: ${module}`);
    const configModule = config[module];

    if (configModule.saEncrypted) {
      const isFileExist = await Bun.file(configModule.saPath).exists();

      // If SA file already exist, skip generating
      if (isFileExist) {
        moduleLogger.warn("SA file already exist. Skipping...");
        return configModule.saPath;
      }

      const saFileString = base64Decode(configModule.saEncrypted);
      moduleLogger.warn(`SA file path: ${configModule.saPath}`);
      await Bun.write(configModule.saPath, saFileString);
      moduleLogger.info("SA file generated!");

      return configModule.saPath;
    }

    moduleLogger.error("Failed to generate SA file. SA encrypted is not defined.");
    throw new Error("Failed to generate SA encrypted is not defined.");
  } catch (error) {
    moduleLogger.error(error, "Failed to generate SA file.");
    throw error;
  }
}

/**
 * Generate JWT credentials for Google API.
 * @param module - Module name. Based on available modules in config. E.g. "calculator", "onm-suite"
 * @returns JWT service account credentials.
 */
export async function generateJWT(module: "calculator" | "onm-suite") {
  try {
    const configModule = config[module];
    const saFileModuleJson = await Bun.file(configModule.saPath).json();

    return new auth.JWT({
      email: saFileModuleJson.client_email,
      key: saFileModuleJson.private_key,
      scopes: configModule.google.scopes,
    });
  } catch (error) {
    moduleLogger.error(error, "Failed to generate JWT client for Google API.");
    throw error;
  }
}
