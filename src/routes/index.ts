import express from 'express';
import { config } from '../config/env';
import { getCacheStats } from '../middleware/cache';
import { redis } from '../config/redis';
import playlistRoutes from './playlist.routes';

const router = express.Router();

// Basic health check route
router.get('/health', async (req, res) => {
  req.log.info('Health check requested');

  try {
    // Check Redis health - this will return false values if unavailable
    const redisHealth = await redis.healthCheck();
    const cacheStats = await getCacheStats();

    // Health check always succeeds, but shows Redis status
    res.json({
      status: 'ok',
      env: config.env,
      timestamp: new Date().toISOString(),
      redis: redisHealth,
      cache: cacheStats,
    });
  } catch (error) {
    req.log.error({ err: error }, 'Health check failed');
    // Even if health check has errors, return 200 with Redis as unavailable
    res.json({
      status: 'ok',
      env: config.env,
      timestamp: new Date().toISOString(),
      redis: { cache: false, logs: false, pubsub: false },
      cache: { totalKeys: 0, memoryUsage: 'unavailable', hitRate: 0 },
      note: 'Redis unavailable',
    });
  }
});

// Cache management routes (development only)
if (config.isDevelopment) {
  router.get('/cache/stats', async (req, res) => {
    try {
      const stats = await getCacheStats();
      res.json({
        message: 'Cache statistics retrieved',
        stats,
      });
    } catch (error) {
      req.log.error({ err: error }, 'Failed to get cache stats');
      res.status(500).json({ error: 'Failed to get cache stats' });
    }
  });

  router.delete('/cache/clear', async (req, res) => {
    try {
      // Check if Redis is available before attempting to clear
      if (!redis.isAvailable()) {
        return res.json({
          message: 'Cache clear skipped - Redis unavailable',
          pattern: (req.query.pattern as string) || '*',
          deleted: 0,
          keys: 0,
        });
      }

      const pattern = (req.query.pattern as string) || '*';
      const keys = await redis.cache.keys(pattern);
      const deleted = keys.length > 0 ? await redis.cache.del(...keys) : 0;

      res.json({
        message: 'Cache cleared',
        pattern,
        deleted,
        keys: keys.length,
      });
    } catch (error) {
      req.log.error({ err: error }, 'Failed to clear cache');
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  });
}

// Mount feature routes
router.use('/playlists', playlistRoutes);

export default router;
