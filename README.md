# Node.js TypeScript API Boilerplate

[![CI](https://github.com/danielevilela/nodejs-api-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/danielevilela/nodejs-api-boilerplate/actions/workflows/ci.yml)

A robust boilerplate for building scalable Node.js APIs using TypeScript and Express.js.

## Features

- **TypeScript Support**: Full TypeScript integration with proper configuration
- **Express.js**: Fast, unopinionated web framework
- **Environment Configuration**: Using `dotenv` with Zod schema validation
- **Error Handling**: Global error handler with custom error classes
- **Logging**: Structured logging with Pino for high performance
- **Security**: Helmet security headers, CORS, and rate limiting
- **Code Quality**:
  - ESLint for code linting
  - Prettier for code formatting
- **Development Tools**:
  - Hot reload with ts-node-dev
  - Source map support
  - Path aliases

## Project Structure

```text
src/
  ├── config/         # Configuration files
  │   └── env.ts     # Environment variables configuration
  ├── middleware/     # Express middlewares
  │   ├── errorHandler.ts  # Global error handling middleware
  │   ├── errors.ts       # Custom error classes and factories
  │   └── security.ts     # Security middleware (Helmet, CORS, rate limiting)
  ├── utils/          # Utility functions
  │   └── logger.ts   # Pino logger configuration
  ├── app.ts         # Express app setup and middleware
  └── server.ts      # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/danielevilela/nodejs-api-boilerplate.git
cd nodejs-api-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp .env.example .env
```

4. Start development server:

```bash
npm run dev
```

The server will start on the port specified in your .env file (default: 3000).

## Environment Variables

The following environment variables can be configured in your .env file:

```bash
NODE_ENV=development    # development, production, or test
PORT=3000              # Port number for the server
API_PREFIX=/api        # Prefix for all API routes

# Security Settings
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX=100          # Maximum requests per window
CORS_ORIGIN=*               # Use specific origins in production
TRUST_PROXY=false          # Set to true if behind a reverse proxy
```

All environment variables are validated using Zod schema validation.

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if files are properly formatted

## Code Quality

### ESLint

The project uses ESLint with TypeScript support for code linting. Configuration can be found in `eslint.config.js`.

Key features:

- TypeScript-specific rules
- Prettier integration
- Custom rules for unused variables and type safety

### Prettier

Prettier is configured for consistent code formatting. Configuration can be found in `.prettierrc`.

Settings include:

- Single quotes
- Semicolons
- 100 characters line length
- 2 spaces indentation

## Logging

The project uses Pino for high-performance, structured logging:

- **Structured Logging**: JSON-formatted logs for easy parsing and analysis
- **Request Logging**: Automatic HTTP request/response logging
- **Performance**: Extremely fast logging with minimal overhead
- **Development Mode**: Pretty-printed, colorized logs for better readability
- **Production Mode**: Optimized JSON output for log aggregation systems

### Log Levels

- `debug`: Detailed information for diagnosing problems
- `info`: General information about application flow
- `warn`: Warning messages for potentially harmful situations
- `error`: Error events that still allow the application to continue
- `fatal`: Very severe error events that may abort the application

### Usage Example

```typescript
import { logger } from './utils/logger';

// Log different levels
logger.info('User created successfully', { userId: 123 });
logger.warn('Rate limit approaching', { ip: '192.168.1.1', requests: 95 });
logger.error({ err }, 'Database connection failed');
```

## Security

The project includes multiple security layers:

- **Helmet**: Security headers to protect against common vulnerabilities
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: Prevents brute force attacks and API abuse
- **Request Size Limiting**: Limits request body size to prevent DoS attacks
- **Security Headers**: XSS protection, content type options, and more

## Error Handling

The project includes a robust error handling system:

- Custom `AppError` class for operational errors
- Global error handling middleware
- Built-in error factories for common HTTP errors
- Environment-specific error responses
- Validation error handling with Zod
- Structured error logging with Pino

## Testing

The project uses Jest for testing and includes:

- Unit tests for middleware and utilities
- Integration tests for API endpoints
- Test coverage reporting

### Available Test Commands

- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage reporting

### Continuous Integration

The project is set up with GitHub Actions to run the following checks on every pull request and push to main:

- Linting and code style checks
- Unit and integration tests
- Test coverage reporting to Codecov
- Node.js version compatibility (18.x and 20.x)
