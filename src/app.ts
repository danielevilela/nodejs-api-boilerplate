import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/errors';
import { corsConfig, rateLimiter, securityHeaders } from './middleware/security';
import { getCacheStats } from './middleware/cache';
import { redis } from './config/redis';
import userRoutes from './routes/user.routes';
import { logger } from './utils/logger';
import pinoHttp from 'pino-http';

const app = express();

// Attach Pino HTTP logger middleware
app.use(pinoHttp({ logger }));

// Security middleware
app.use(securityHeaders); // Apply Helmet security headers
app.use(corsConfig); // Apply CORS configuration
app.use(rateLimiter); // Apply rate limiting

// Middleware for parsing JSON bodies
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb

// API routes
const apiRouter = express.Router();

// Basic health check route
apiRouter.get('/health', async (req, res) => {
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
  apiRouter.get('/cache/stats', async (req, res) => {
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

  apiRouter.delete('/cache/clear', async (req, res) => {
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

// Mount user routes with caching
apiRouter.use('/users', userRoutes);

// Mount API router with prefix
app.use(config.apiPrefix, apiRouter);

// Swagger documentation
if (config.env === 'development') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve Swagger spec as JSON
  app.get('/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// Handle 404 errors
app.use((_req, _res, next) => {
  next(notFound());
});

// Global error handler
app.use(errorHandler);

export default app;
