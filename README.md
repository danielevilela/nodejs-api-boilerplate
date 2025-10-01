# Node.js TypeScript API Boilerplate

[![CI](https://github.com/danielevilela/nodejs-api-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/danielevilela/nodejs-api-boilerplate/actions/workflows/ci.yml)

**🚀 A scalable Node.js API boilerplate** built with TypeScript, Redis caching, structured logging, comprehensive security, and modern development tools. Perfect for kickstarting an API project with solid foundations and best practices built-in.

> **Quick Start**: Clone, install dependencies, start Redis, and you're ready to build! All the boilerplate code is done for you.

## Features

### 🚀 **Core Framework**

- **TypeScript Support**: Full TypeScript integration with strict configuration
- **Express.js**: Fast, unopinionated web framework with modern middleware
- **Environment Configuration**: Type-safe environment validation with Zod schemas

### 📊 **Redis Integration**

- **Multi-Database Setup**: Separate Redis databases for caching, logging, and pub/sub
- **Advanced Caching**: Intelligent caching middleware with TTL, invalidation, and statistics
- **Cache Management**: Development endpoints for cache inspection and clearing
- **Health Monitoring**: Real-time Redis connection health checks

### 🔒 **Security & Performance**

- **Comprehensive Security**: Helmet security headers, CORS, and intelligent rate limiting
- **Request Validation**: Zod-based input validation with detailed error responses
- **Performance Monitoring**: Request timing and cache hit/miss tracking
- **Graceful Error Handling**: Robust error handling with structured logging

### 📝 **Advanced Logging**

- **Structured Logging**: High-performance Pino logging with JSON output
- **HTTP Request Logging**: Automatic request/response logging with performance metrics
- **Cache Analytics**: Detailed cache operation logging and statistics
- **Development Mode**: Pretty-printed, colorized logs for enhanced debugging

### 🔧 **Development Experience**

- **Hot Reload**: Fast development with ts-node-dev
- **Code Quality**: ESLint + Prettier with TypeScript-specific rules
- **Path Aliases**: Clean imports with @ aliases
- **Docker Support**: Redis containerization with Docker Compose

### 📖 **API Documentation**

- **Swagger/OpenAPI**: Interactive API documentation with real-time testing
- **Auto-Generated Docs**: Swagger UI with endpoint exploration and testing
- **Schema Validation**: Automatic request/response schema documentation
- **Development Integration**: Live documentation updates during development

### 🧪 **Testing & CI**

- **Comprehensive Testing**: Unit and integration tests with Jest
- **Cache Testing**: Specialized cache integration tests with Redis
- **Coverage Reporting**: Test coverage with detailed reports
- **GitHub Actions**: Automated CI/CD with multiple Node.js versions

## Project Structure

```text
src/
  ├── __tests__/           # Test files
  │   └── integration/     # Integration tests
  │       └── cache.test.ts # Cache integration tests
  ├── config/              # Configuration files
  │   ├── env.ts          # Environment variables with Zod validation
  │   └── redis.ts        # Redis configuration and connection management
  ├── middleware/          # Express middlewares
  │   ├── cache.ts        # Redis caching middleware with TTL & invalidation
  │   ├── errorHandler.ts # Global error handling with structured logging
  │   ├── errors.ts       # Custom error classes and HTTP error factories
  │   ├── security.ts     # Security middleware (Helmet, CORS, rate limiting)
  │   └── validate.ts     # Request validation middleware with Zod
  ├── routes/              # API route definitions
  │   └── user.routes.ts  # User endpoints with caching integration
  ├── schemas/             # Zod validation schemas
  │   └── user.schema.ts  # User request/response schemas
  ├── scripts/             # Utility scripts
  │   └── test-redis.ts   # Redis connection testing and health checks
  ├── utils/               # Utility functions
  │   └── logger.ts       # Pino logger with development/production modes
  ├── app.ts              # Express app with Redis health checks & cache management
  └── server.ts           # Server entry point with graceful shutdown
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Docker & Docker Compose** (for Redis - recommended)
- **Redis** (if not using Docker)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/danielevilela/nodejs-api-boilerplate.git
cd nodejs-api-boilerplate
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Redis (using Docker - recommended):**

```bash
npm run docker:redis
```

Or start Redis locally if you have it installed:

```bash
redis-server
```

5. **Start development server:**

```bash
npm run dev
```

The server will start on the port specified in your .env file (default: 3000).

### 📖 Swagger API Documentation

Once your server is running, explore the interactive API documentation:

```bash
# Open Swagger UI in your browser
http://localhost:3000/api-docs
```

**Swagger Features:**

- **Interactive Testing**: Test all endpoints directly from the browser
- **Schema Validation**: View request/response schemas with examples
- **Real-time Updates**: Documentation updates automatically with code changes
- **Try It Out**: Execute API calls with sample data and see live responses

### Quick Test

Test the API and caching functionality:

```bash
# Test basic endpoint
curl http://localhost:3000/api/health

# Test caching (first request - cache miss)
curl -i http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000

# Test caching (second request - cache hit)
curl -i http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000

# View cache statistics (development mode)
curl http://localhost:3000/api/cache/stats
```

## Environment Variables

The following environment variables can be configured in your .env file:

```bash
# Server Configuration
NODE_ENV=development    # development, production, or test
PORT=3000              # Port number for the server
API_PREFIX=/api        # Prefix for all API routes

# Redis Configuration
REDIS_HOST=localhost   # Redis server hostname
REDIS_PORT=6379       # Redis server port
REDIS_PASSWORD=       # Redis password (optional)

# Security Settings
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX=100          # Maximum requests per window
CORS_ORIGIN=*               # Use specific origins in production
TRUST_PROXY=false          # Set to true if behind a reverse proxy
```

All environment variables are validated using Zod schema validation with detailed error messages.

## Available Scripts

### Development

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production server

### Redis & Docker

- `npm run docker:redis` - Start Redis container with Docker Compose
- `npm run docker:down` - Stop all Docker containers
- `npm run test:redis` - Test Redis connection and operations

### Code Quality

- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if files are properly formatted

### Testing

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage reporting

## Redis Integration

### Architecture

This boilerplate uses a **multi-database Redis setup** for optimal performance and organization:

- **Database 0**: HTTP response caching with intelligent TTL management
- **Database 1**: Application logs and audit trails (future use)
- **Database 2**: Pub/sub messaging and real-time features (future use)

### Caching Strategy

#### Intelligent Cache Middleware

```typescript
// Automatic caching with TTL
cacheMiddleware({ ttl: 600, keyPrefix: 'user' });

// Cache with custom key generation
cacheMiddleware({
  ttl: 300,
  keyPrefix: 'users_list',
  keyGenerator: (req) => `${req.path}:${JSON.stringify(req.query)}`,
});
```

#### Cache Features

- **Automatic Key Generation**: Based on HTTP method, path, and parameters
- **TTL Management**: Configurable time-to-live for different endpoint types
- **Cache Invalidation**: Pattern-based cache clearing on data updates
- **Cache Headers**: `X-Cache: HIT/MISS` and `X-Cache-Key` for debugging
- **Statistics**: Real-time cache performance metrics
- **Error Resilience**: Graceful fallback when Redis is unavailable

### Development Tools

#### Cache Management Endpoints (Development Only)

```bash
# View cache statistics
GET /api/cache/stats

# Clear cache by pattern
DELETE /api/cache/clear?pattern=user:*

# Health check with Redis status
GET /api/health
```

#### Redis Testing

```bash
# Test Redis connection and operations
npm run test:redis

# Run cache integration tests
npm test -- --testPathPatterns=cache.test.ts
```

### Production Considerations

- Cache management endpoints are **automatically disabled** in production
- Redis connection pooling with health monitoring
- Comprehensive error handling and logging
- Memory usage monitoring and alerts

## Code Quality & Standards

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

## Advanced Logging

### Structured Logging with Pino

The project uses **Pino** for high-performance logging:

- **JSON Structured**: Machine-readable logs for easy parsing and analysis
- **HTTP Request Logging**: Automatic request/response logging with performance metrics
- **Cache Analytics**: Detailed cache hit/miss logging and performance tracking
- **Error Context**: Rich error logging with stack traces and contextual data
- **Performance**: Extremely fast logging with minimal overhead (~10x faster than alternatives)

### Environment-Specific Configuration

#### Development Mode

- **Pretty-printed**: Colorized, human-readable console output
- **Debug level**: Verbose logging for development insights
- **Cache debugging**: Detailed cache operation logs

#### Production Mode

- **JSON output**: Optimized for log aggregation systems (ELK, Splunk, etc.)
- **Info level**: Balanced logging for performance
- **Structured context**: Rich metadata for monitoring and alerting

### Log Categories

#### Application Logs

```typescript
logger.info('User created successfully', { userId: 123, email: 'user@example.com' });
logger.warn('Rate limit approaching', { ip: '192.168.1.1', requests: 95 });
logger.error({ err }, 'Database connection failed');
```

#### HTTP Request Logs

```json
{
  "level": 30,
  "time": 1696147200000,
  "req": {
    "method": "GET",
    "url": "/api/users/123",
    "headers": { "user-agent": "..." }
  },
  "res": {
    "statusCode": 200,
    "headers": { "x-cache": "HIT" }
  },
  "responseTime": 45
}
```

#### Cache Operation Logs

```json
{
  "level": 20,
  "time": 1696147200000,
  "msg": "Cache hit",
  "cacheKey": "user:GET:/api/users/123",
  "hit": true,
  "responseTime": 2
}
```

### Log Analysis

- **Performance monitoring**: Track response times and cache efficiency
- **Error tracking**: Centralized error logging with context
- **User activity**: Audit trails and usage analytics
- **System health**: Redis connectivity and application metrics

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

## Testing & Quality Assurance

### Comprehensive Test Suite

The project includes a robust testing framework with **Jest**:

#### Test Categories

- **Unit Tests**: Middleware, utilities, and individual components
- **Integration Tests**: Full API endpoint testing with Redis
- **Cache Tests**: Specialized Redis caching functionality tests
- **Error Handling Tests**: Comprehensive error scenario coverage

#### Redis Integration Testing

```typescript
// Example cache integration test
it('should return X-Cache: HIT on subsequent requests', async () => {
  const response1 = await request(app).get('/api/users/123').expect(200);
  expect(response1.headers['x-cache']).toBe('MISS');

  const response2 = await request(app).get('/api/users/123').expect(200);
  expect(response2.headers['x-cache']).toBe('HIT');
});
```

#### Test Features

- **Real Redis Testing**: Integration tests use actual Redis instances
- **Cache Validation**: Verify cache headers, TTL, and invalidation
- **Error Scenarios**: Test graceful degradation when Redis is unavailable
- **Performance Testing**: Validate response times and cache efficiency

### Test Commands

- `npm test` - Run complete test suite
- `npm run test:watch` - Interactive test runner
- `npm run test:coverage` - Generate coverage reports
- `npm run test:redis` - Test Redis connectivity and operations

## Docker & Deployment

### Redis with Docker Compose

The project includes a `docker-compose.yml` for easy Redis setup:

```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 30s
      timeout: 10s
      retries: 5
```

#### Docker Commands

```bash
# Start Redis container
npm run docker:redis

# Stop all containers
npm run docker:down

# View Redis logs
docker-compose logs redis
```

### Production Deployment

#### Environment Setup

- Set `NODE_ENV=production`
- Configure Redis connection with proper credentials
- Set up log aggregation (ELK stack, Splunk, etc.)
- Configure monitoring and alerting

#### Performance Optimizations

- Redis connection pooling enabled
- Cache management endpoints automatically disabled
- Optimized JSON logging for production
- Error handling with graceful degradation

### Continuous Integration

The project includes **GitHub Actions** CI/CD pipeline:

#### Automated Checks

- **Code Quality**: ESLint and Prettier validation
- **Testing**: Complete test suite including Redis integration
- **Coverage**: Test coverage reporting with detailed metrics
- **Compatibility**: Node.js versions 18.x and 20.x
- **Security**: Dependency vulnerability scanning

#### Pipeline Features

- **Redis Service**: CI includes Redis container for integration testing
- **Parallel Jobs**: Optimized pipeline with concurrent test execution
- **Caching**: NPM dependencies cached for faster builds
- **Notifications**: Automated status updates and failure alerts

## API Documentation

### Example Endpoints

#### User Management

```bash
# Get user (with caching)
GET /api/users/:id
Response Headers: X-Cache: MISS/HIT, X-Cache-Key: user:GET:/api/users/123

# List users (with pagination and caching)
GET /api/users?page=1&limit=10
Response Headers: X-Cache: MISS/HIT, X-Cache-Key: users_list:GET:/api/users?page=1&limit=10

# Create user (no caching)
POST /api/users
Body: { "username": "john", "email": "john@example.com", "password": "Password123" }

# Update user (with cache invalidation)
PATCH /api/users/:id
Body: { "username": "john_updated" }
```

#### System Endpoints

```bash
# Health check with Redis status
GET /api/health
Response: {
  "status": "healthy",
  "redis": { "cache": "connected", "logs": "connected", "pubsub": "connected" },
  "cache": { "enabled": true }
}

# Cache statistics (development only)
GET /api/cache/stats
Response: { "message": "Cache statistics", "stats": { "totalKeys": 5, "memoryUsage": "1.2MB" } }

# Clear cache (development only)
DELETE /api/cache/clear?pattern=user:*
Response: { "message": "Cache cleared", "pattern": "user:*", "deleted": 3 }
```

### Response Format

All API responses follow a consistent structure:

```json
{
  "message": "Operation successful",
  "data": { ... },
  "cached": true,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **Pino** - Super fast, low overhead Node.js logger
- **Redis** - In-memory data structure store
- **TypeScript** - Typed superset of JavaScript
- **Jest** - Delightful JavaScript testing framework
