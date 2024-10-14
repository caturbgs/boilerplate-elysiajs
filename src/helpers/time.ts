/**
 * Execute a function with retry mechanism
 * @param {Function} func Function to be executed
 * @param {number} maxRetries Maximum number of retries
 * @param {number} retryInterval Interval between retries
 * @returns Result of the function
 */
export async function executeWithRetry<T>(
  func: () => Promise<T>,
  maxRetries: number,
  retryInterval: number,
): Promise<T> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await func();
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      await Bun.sleep(retryInterval);
    }
  }
  throw new Error("This should never happen");
}
