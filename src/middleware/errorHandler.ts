import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log error with structured data
  const errorContext = {
    err: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  };

  // Handle AppError instances
  if (err instanceof AppError) {
    logger.error(errorContext, `Application error: ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(config.isDevelopment && { stack: err.stack }),
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    logger.error({ ...errorContext, validationErrors: err.issues }, 'Validation error');
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.issues,
    });
  }

  // Handle unknown errors
  logger.error(errorContext, 'Unhandled application error');
  return res.status(500).json({
    status: 'error',
    message: config.isProduction ? 'Internal server error' : err.message,
    ...(config.isDevelopment && { stack: err.stack }),
  });
};
