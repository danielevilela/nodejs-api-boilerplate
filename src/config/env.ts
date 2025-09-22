import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define environment variables schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('/api'),
  // Security settings
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX: z.coerce.number().default(100), // 100 requests per window
  CORS_ORIGIN: z.string().default('*'), // In production, change to specific origins
});

// Validate and transform environment variables
const envVars = envSchema.parse(process.env);

// Export configuration object
export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiPrefix: envVars.API_PREFIX,
  isDevelopment: envVars.NODE_ENV === 'development',
  isProduction: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',
  security: {
    rateLimitWindowMs: envVars.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: envVars.RATE_LIMIT_MAX,
    corsOrigin: envVars.CORS_ORIGIN,
  },
} as const;
