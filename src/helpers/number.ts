/**
 * Parsing number from google sheet
 * @param {number} number - Number from google sheet
 * @returns {string} Formatted number
 */
export function parsingNumberGsheet(number: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

/**
 * Format currency
 * @param {number} number - Number to be formatted
 * @param {string} [currency="IDR"] - Currency. Default is IDR
 * @param {string} [locale="id-ID"] - Locale. Default is id-ID
 * @returns {string} Formatted currency
 */
export function formatCurrency(number: number, currency = "IDR", locale = "id-ID") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(number);
}

/**
 * Format number from google sheet
 * @param {string} string - String from google sheet
 * @returns {number} Formatted number
 */
export function formatNumberGsheet(string: string) {
  if (string === "" || string === "-") {
    return 0;
  }

  return Number(string.replace(/,/g, ""));
}

/**
 * Check if value is number
 * Might be useful for checking after computation, to be exclude NaN or Infinity too.
 * @param {unknown} value - check if value is number
 * @returns {boolean} - return true if value is number
 */
export function isNumber(value: unknown): boolean {
  return !Number.isNaN(value) && Number.isFinite(value);
}

/**
 * Rounding number with decimal
 * @param {number} number - Number to be rounded
 * @param {number} [decimal] - (Optional) Decimal number. Default is 2
 * @returns {number} Rounded number
 */
export function roundingNumberDecimal(number: number, decimal = 2): number {
  return Number(number.toFixed(decimal));
}
