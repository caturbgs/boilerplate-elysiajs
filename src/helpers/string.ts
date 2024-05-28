import path from "node:path";
import { write } from "bun";
import config from "../config";
import { log } from "../libs/logger";

/**
 * Convert a string to sentence case
 * @param word string to be converted
 * @returns string string in sentence case
 */
export function toSentenceCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Convert a sentence to title case
 * @param sentence string to be converted
 * @returns string string in title case
 */
export function toTitleCase(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) => toSentenceCase(word))
    .join(" ");
}

/**
 * Decode base64 into string
 * @param data base64 string
 * @returns string decoded string
 */
export function base64Decode(data: string): string {
  return Buffer.from(data, "base64").toString();
}

/**
 * Encode string into base64
 * @param data string to be encoded
 * @returns string encoded string
 */
export function base64Encode(data: string): string {
  return Buffer.from(data).toString("base64");
}

/**
 * Generate service account file from environment variable.
 * If production, generate production SA file. Otherwise, generate development SA file.
 * @returns string path to service account file
 */
export async function generateSAFile() {
  const filename = path.join(process.cwd(), "/xurya-calculator.json");

  // Only generate SA file on production and sandbox environment
  if (config.envMode && config.envMode !== "development" && config.saEncrypted) {
    const isFileExist = await Bun.file(filename).exists();

    // If SA file already exist, skip generating
    if (isFileExist) {
      log.warn("SA file already exist. Skipping...");
      return filename;
    }

    log.info("Generating SA file...");
    const saFileString = base64Decode(config.saEncrypted);
    log.warn(`SA file path: ${filename}`);
    await write(filename, saFileString);
    log.info("SA file generated");

    return filename;
  }
}
