import { Request, Response, NextFunction } from 'express';
import { cache, redis } from '../config/redis';
import { logger } from '../utils/logger';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string; // Prefix for cache keys
  skipCache?: boolean; // Skip cache for this request
}

interface CachedRequest extends Request {
  cacheKey?: string;
  cacheOptions?: CacheOptions;
}

/**
 * Generate cache key from request
 */
function generateCacheKey(req: Request, prefix?: string): string {
  const baseKey = `${req.method}:${req.originalUrl}`;
  const queryString = Object.keys(req.query).length > 0 ? `:${JSON.stringify(req.query)}` : '';

  return prefix ? `${prefix}:${baseKey}${queryString}` : `${baseKey}${queryString}`;
}

/**
 * Cache middleware factory
 */
export function cacheMiddleware(options: CacheOptions = {}) {
  const {
    ttl = 300, // Default 5 minutes
    keyPrefix = 'api',
    skipCache = false,
  } = options;

  return async (req: CachedRequest, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests or if explicitly disabled
    if (req.method !== 'GET' || skipCache) {
      return next();
    }

    // Skip caching if Redis is not available
    if (!redis.isAvailable()) {
      res.set('X-Cache', 'SKIP');
      return next();
    }

    const cacheKey = generateCacheKey(req, keyPrefix);
    req.cacheKey = cacheKey;
    req.cacheOptions = { ttl, keyPrefix, skipCache };

    try {
      // Try to get cached response
      const cachedResponse = await cache.get(cacheKey);

      if (cachedResponse) {
        const parsed = JSON.parse(cachedResponse);

        logger.info(
          {
            cacheKey,
            hit: true,
            method: req.method,
            url: req.originalUrl,
          },
          'Cache hit'
        );

        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Key', cacheKey);

        return res.json(parsed);
      }

      // Cache miss - continue to handler
      logger.debug(
        {
          cacheKey,
          hit: false,
          method: req.method,
          url: req.originalUrl,
        },
        'Cache miss'
      );

      res.set('X-Cache', 'MISS');
      res.set('X-Cache-Key', cacheKey);

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = function (data: unknown) {
        // Cache the response asynchronously only if Redis is available
        if (redis.isAvailable()) {
          setImmediate(async () => {
            try {
              await cache.setex(cacheKey, ttl, JSON.stringify(data));
              logger.debug(
                {
                  cacheKey,
                  ttl,
                  dataSize: JSON.stringify(data).length,
                },
                'Response cached'
              );
            } catch (error) {
              logger.error(
                {
                  err: error,
                  cacheKey,
                },
                'Failed to cache response'
              );
            }
          });
        }

        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error(
        {
          err: error,
          cacheKey,
          method: req.method,
          url: req.originalUrl,
        },
        'Cache middleware error'
      );

      // Continue without caching on error
      res.set('X-Cache', 'ERROR');
      next();
    }
  };
}

/**
 * Cache invalidation helper
 */
export async function invalidateCache(pattern: string): Promise<number> {
  try {
    // Skip invalidation if Redis is not available
    if (!redis.isAvailable()) {
      logger.warn('Redis not available, skipping cache invalidation');
      return 0;
    }

    const keys = await cache.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }

    const deleted = await cache.del(...keys);
    logger.info(
      {
        pattern,
        keysDeleted: deleted,
        totalKeys: keys.length,
      },
      'Cache invalidated'
    );

    return deleted;
  } catch (error) {
    logger.error(
      {
        err: error,
        pattern,
      },
      'Cache invalidation failed'
    );
    throw error;
  }
}

/**
 * Cache statistics helper
 */
export async function getCacheStats(): Promise<{
  totalKeys: number;
  memoryUsage: string;
  hitRate?: number;
}> {
  try {
    // Return empty stats if Redis is not available
    if (!redis.isAvailable()) {
      return {
        totalKeys: 0,
        memoryUsage: 'unavailable',
        hitRate: 0,
      };
    }

    const info = await cache.info('memory');
    const keyspace = await cache.info('keyspace');
    const stats = await cache.info('stats');

    // Parse memory info
    const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1] : 'unknown';

    // Parse keyspace info
    const keysMatch = keyspace.match(/keys=(\d+)/);
    const totalKeys = keysMatch ? parseInt(keysMatch[1]) : 0;

    // Parse hit rate (if available)
    const hitsMatch = stats.match(/keyspace_hits:(\d+)/);
    const missesMatch = stats.match(/keyspace_misses:(\d+)/);

    let hitRate: number | undefined;
    if (hitsMatch && missesMatch) {
      const hits = parseInt(hitsMatch[1]);
      const misses = parseInt(missesMatch[1]);
      const total = hits + misses;
      hitRate = total > 0 ? (hits / total) * 100 : 0;
    }

    return {
      totalKeys,
      memoryUsage,
      hitRate,
    };
  } catch (error) {
    logger.error({ err: error }, 'Failed to get cache stats');
    throw error;
  }
}

/**
 * Manual cache setter
 */
export async function setCache(key: string, data: unknown, ttl: number = 300): Promise<void> {
  try {
    // Skip setting cache if Redis is not available
    if (!redis.isAvailable()) {
      logger.warn('Redis not available, skipping manual cache set');
      return;
    }

    await cache.setex(key, ttl, JSON.stringify(data));
    logger.debug({ key, ttl }, 'Manual cache set');
  } catch (error) {
    logger.error({ err: error, key }, 'Manual cache set failed');
    throw error;
  }
}

/**
 * Manual cache getter
 */
export async function getCache(key: string): Promise<unknown | null> {
  try {
    // Return null if Redis is not available
    if (!redis.isAvailable()) {
      logger.debug('Redis not available, returning null for cache get');
      return null;
    }

    const cached = await cache.get(key);
    if (cached) {
      logger.debug({ key }, 'Manual cache get - hit');
      return JSON.parse(cached);
    }
    logger.debug({ key }, 'Manual cache get - miss');
    return null;
  } catch (error) {
    logger.error({ err: error, key }, 'Manual cache get failed');
    return null;
  }
}
