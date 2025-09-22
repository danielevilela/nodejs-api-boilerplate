import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/errors';
import { corsConfig, rateLimiter, securityHeaders } from './middleware/security';
import userRoutes from './routes/user.routes';

const app = express();

// Security middleware
app.use(securityHeaders); // Apply Helmet security headers
app.use(corsConfig); // Apply CORS configuration
app.use(rateLimiter); // Apply rate limiting

// Middleware for parsing JSON bodies
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb

// API routes
const apiRouter = express.Router();

// Basic health check route
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: config.env });
});

// Mount user routes
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
