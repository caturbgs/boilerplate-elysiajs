import { format } from "date-fns";
import { createClient } from "redis";
import config from "../config";
import { createLoggerInstance } from "./logger";

const moduleLogger = createLoggerInstance("libs/redis");

const client = createClient({
  username: config.redis.username,
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

/**
 * Initialize Redis client.
 * Used to initialize Redis Client every time the server starts
 */
export async function initializeRedis() {
  moduleLogger.info("Initializing Redis client...");

  client.on("error", (err) => moduleLogger.error(`Error in initializing redis: ${err}`));

  await client.connect();
}

/**
 * Get Redis cached value.
 * Used to get redis cache that will be used on middleware before the request is handled.
 * @param key Key of the cache
 * @returns Record<string, any>[] value
 */
export async function getCacheRedis<T = unknown>(key: string) {
  try {
    const cacheResults = await client.get(key);

    if (cacheResults) {
      moduleLogger.debug(`Get Cached value ==> ${key}`);
      return JSON.parse(cacheResults) as T;
    }

    return;
  } catch (error) {
    moduleLogger.error(error, "Error in getCacheRedis");
  }
}

/**
 * Get list of Redis cached value with TTL.
 *
 * @returns List of Redis cached value with TTL
 */
export async function getCacheListRedis() {
  try {
    const cacheResults = await client.keys("*");

    if (cacheResults) {
      moduleLogger.debug("Get Cached value list");

      return await Promise.all(
        cacheResults.map(async (key) => {
          const ttl = await client.ttl(key);

          return {
            key,
            ttl,
            expired_in: format(new Date(Date.now() + ttl * 1000), "yyyy-MM-dd HH:mm:ss"),
          };
        }),
      );
    }

    return [];
  } catch (error) {
    moduleLogger.error(error, "Error in getCacheListRedis");
  }
}

/**
 * Set Redis cache value.
 * This is used to cache the results of the API. This is used to reduce the number of requests to the API.
 * @param key Key of the cache
 * @param value Value of the cached value
 * @param ttl Time to live of the cached value in seconds. Default to 60 minutes.
 */
// TODO: remove default value of ttl. This is only used until all the onm dashboard is migrated to use redis.
export async function setCacheRedis<T = Record<string, unknown>[]>(
  key: string,
  value: T,
  ttl = 60 * config.redis.expired_time,
) {
  try {
    moduleLogger.debug(`Set Cached value ==> ${key}`);
    await client.set(key, JSON.stringify(value), {
      EX: ttl, // Set the specified expire time, in seconds.
    });
  } catch (error) {
    moduleLogger.error(error, "Error in setCacheRedis");
  }
}

/**
 * Get or Set Redis cache value.
 * This is used to combine getCacheRedis and setCacheRedis.
 * @param key Key of the cache
 * @param cb Callback function that will be called if the cache is not found
 * @param ttl Time to live of the cached value
 * @returns Record<string, any>[] value
 */
export async function getOrSetCacheRedis<T = Record<string, unknown>[]>(
  key: string,
  cb: () => Promise<T>,
  ttl?: number,
): Promise<T> {
  try {
    const cacheResults = await getCacheRedis(key);

    if (cacheResults) {
      moduleLogger.info(`getOrSetCacheRedis: Cached hit ==> ${key}`);
      moduleLogger.debug(`getOrSetCacheRedis: Get Cached value ==> ${key}`);
      return cacheResults as T;
    }

    moduleLogger.info(`getOrSetCacheRedis: Cached miss ==> ${key}`);
    moduleLogger.info("getOrSetCacheRedis: Fetching data from data source");
    const value = await cb();

    moduleLogger.info(`getOrSetCacheRedis: Setting cache value ==> ${key}`);
    moduleLogger.debug(`getOrSetCacheRedis: Set Cached value ==> ${key}`);
    await setCacheRedis(key, value, ttl);

    return value as T;
  } catch (error) {
    moduleLogger.error(error, "Error in getOrSetCacheRedis");
    throw error;
  }
}

/**
 * Delete All Redis cache value.
 * This is used to delete all the cache value in Redis.
 * @param cacheKey Option to delete specific cache value. If not provided, all cache value will be deleted. Default to undefined.
 */
export async function deleteCacheRedis(cacheKey?: string, onmSuite = false) {
  try {
    if (cacheKey) {
      if (onmSuite) {
        switch (cacheKey) {
          case "daily": {
            moduleLogger.debug("Delete daily cached value");
            const dailyRedisKeys = await client.keys("daily*");
            for (const key of dailyRedisKeys) {
              await client.del(key);
            }
            break;
          }
          case "weekly": {
            moduleLogger.debug("Delete weekly cached value");
            const weeklyRedisKeys = await client.keys("weekly*");
            for (const key of weeklyRedisKeys) {
              await client.del(key);
            }
            break;
          }
          case "monthly": {
            moduleLogger.debug("Delete monthly cached value");
            const monthlyRedisKeys = await client.keys("monthly*");
            for (const key of monthlyRedisKeys) {
              await client.del(key);
            }
            break;
          }
          case "annual": {
            moduleLogger.debug("Delete annual cached value");
            const annualRedisKeys = await client.keys("annual*");
            for (const key of annualRedisKeys) {
              await client.del(key);
            }
            break;
          }
          default:
            moduleLogger.debug("Unrecognized cache key");
            break;
        }
      } else {
        // Delete single cache value
        moduleLogger.debug("Delete cached value");
        await client.del(cacheKey);
      }
    } else {
      moduleLogger.debug("Delete all cached value");
      await client.flushDb();
    }
  } catch (error) {
    moduleLogger.error(error, "Error in deleteAllCacheRedis");
  }
}
