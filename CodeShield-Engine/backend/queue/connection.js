const IORedis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const AVAILABILITY_CACHE_MS = 15000;

let sharedConnection = null;
let cachedAvailability = null; // { value: boolean, checkedAt: number }

/**
 * Returns a shared ioredis connection configured for BullMQ. The connection
 * is created lazily and is configured with `maxRetriesPerRequest: null` (a
 * BullMQ requirement) and `lazyConnect` disabled so failures surface quickly
 * via the `error` event rather than throwing synchronously.
 */
function getRedisConnection() {
    if (!sharedConnection) {
        sharedConnection = new IORedis(REDIS_URL, {
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
            retryStrategy: (times) => Math.min(times * 200, 2000)
        });

        // Swallow connection errors at the module level so an unavailable
        // Redis instance doesn't crash the whole process -- callers should
        // check isRedisAvailable() before relying on the queue.
        sharedConnection.on('error', () => {});
    }
    return sharedConnection;
}

/**
 * Pings Redis to determine whether the async queue / real-time pipeline can
 * be used. Result is cached briefly. When this returns false, callers should
 * fall back to synchronous in-process execution (see submissionRoutes.js).
 *
 * @param {boolean} [force=false] - Bypass the cache and re-check immediately.
 * @returns {Promise<boolean>}
 */
async function isRedisAvailable(force = false) {
    const now = Date.now();
    if (!force && cachedAvailability && (now - cachedAvailability.checkedAt) < AVAILABILITY_CACHE_MS) {
        return cachedAvailability.value;
    }

    const conn = getRedisConnection();
    const value = await new Promise((resolve) => {
        const timer = setTimeout(() => resolve(false), 1500);
        conn.ping()
            .then(() => {
                clearTimeout(timer);
                resolve(true);
            })
            .catch(() => {
                clearTimeout(timer);
                resolve(false);
            });
    });

    cachedAvailability = { value, checkedAt: now };
    return value;
}

module.exports = { getRedisConnection, isRedisAvailable, REDIS_URL };
