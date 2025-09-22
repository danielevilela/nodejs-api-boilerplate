import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { config } from '../config/env';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(config.isDevelopment && { stack: err.stack }),
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // Handle unknown errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    status: 'error',
    message: config.isProduction ? 'Internal server error' : err.message,
    ...(config.isDevelopment && { stack: err.stack }),
  });
};
