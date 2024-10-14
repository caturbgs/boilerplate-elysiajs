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

export function hashSHA256WithSalt(text: string, salt: string): string {
  const hasher = new Bun.CryptoHasher("sha256");

  hasher.update(text);
  hasher.update(salt);

  return hasher.digest("hex");
}

export function verifySHA256WithSalt(text: string, salt: string, hash: string): boolean {
  return hashSHA256WithSalt(text, salt) === hash;
}

/**
 * Check if a string is a valid JSON
 * @param {string} str string to be checked
 * @returns {boolean} true if string is a valid JSON
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return false;
    }
    throw e; // Re-throw if it's an unexpected error
  }
}
