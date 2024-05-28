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
