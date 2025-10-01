import express from 'express';
import { config } from '../../config/env';
import { errorHandler } from '../../middleware/errorHandler';
import { notFound } from '../../middleware/errors';
import { corsConfig, rateLimiter, securityHeaders } from '../../middleware/security';
import { logger } from '../../utils/logger';
import pinoHttp from 'pino-http';
import mockRoutes from './mockRoutes';

const testApp = express();

// Attach Pino HTTP logger middleware
testApp.use(pinoHttp({ logger }));

// Security middleware
testApp.use(securityHeaders);
testApp.use(corsConfig);
testApp.use(rateLimiter);

// Middleware for parsing JSON bodies
testApp.use(express.json({ limit: '10kb' }));

// Mount mock API routes with prefix
testApp.use(config.apiPrefix, mockRoutes);

// Handle 404 errors
testApp.use((_req, _res, next) => {
  next(notFound());
});

// Global error handler
testApp.use(errorHandler);

export default testApp;