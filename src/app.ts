import express from 'express';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/errors';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

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

// Handle 404 errors
app.use((_req, _res, next) => {
  next(notFound());
});

// Global error handler
app.use(errorHandler);

export default app;
