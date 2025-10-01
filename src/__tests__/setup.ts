// Jest test setup - runs before all tests
// Set environment variables to reduce log noise during testing

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Only show error logs during tests
process.env.PINO_LOG_LEVEL = 'error'; // Pino-specific log level
