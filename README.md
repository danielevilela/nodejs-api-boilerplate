# Node.js TypeScript API Boilerplate with Spotify Integration

[![CI](https://github.com/danielevilela/nodejs-api-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/danielevilela/nodejs-api-boilerplate/actions/workflows/ci.yml)

**🚀 A scalable Node.js API boilerplate** built with TypeScript, Redis caching, Spotify Web API integration, structured logging, comprehensive security, and modern development tools. Perfect for building music-focused APIs with solid foundations and best practices built-in.

> **Quick Start**: Clone, install dependencies, configure Spotify credentials, start Redis, and you're ready to build music APIs! All the boilerplate code is done for you.

## Features

### 🎵 **Spotify Web API Integration**

- **Official SDK**: Built with `@spotify/web-api-ts-sdk` for reliability and type safety
- **Client Credentials Flow**: Server-to-server authentication for public data access
- **Playlist Endpoints**: Fetch playlist tracks with comprehensive metadata
- **Smart Caching**: Redis-powered caching for Spotify API responses (30-minute TTL)
- **Error Handling**: Robust error handling with detailed logging for API failures

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
  │   ├── redis.ts        # Redis configuration and connection management
  │   └── swagger.ts      # Swagger/OpenAPI configuration
  ├── middleware/          # Express middlewares
  │   ├── cache.ts        # Redis caching middleware with TTL & invalidation
  │   ├── errorHandler.ts # Global error handling with structured logging
  │   ├── errors.ts       # Custom error classes and HTTP error factories
  │   ├── security.ts     # Security middleware (Helmet, CORS, rate limiting)
  │   └── validate.ts     # Request validation middleware with Zod
  ├── routes/              # API route definitions
  │   ├── index.ts        # Centralized route management
  │   └── playlist.routes.ts # Spotify playlist endpoints with caching
  ├── schemas/             # Zod validation schemas
  │   └── playlist.schema.ts # Playlist request/response schemas
  ├── services/            # External service integrations
  │   └── spotify.ts      # Spotify Web API service with official SDK
  ├── scripts/             # Utility scripts
  │   ├── test-redis.ts   # Redis connection testing and health checks
  │   └── test-spotify.js # Spotify API connection and authentication testing
  ├── utils/               # Utility functions
  │   └── logger.ts       # Pino logger with development/production modes
  ├── app.ts              # Express app setup and middleware configuration
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
# Edit .env with your configuration including Spotify credentials
```

**Required Spotify Configuration:**

Add your Spotify application credentials to `.env`:

```bash
# Spotify Web API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 🎵 How to Get Spotify API Credentials:

1. **Visit Spotify Developer Dashboard**: Go to [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. **Log in** with your Spotify account (create one if needed)
3. **Create a New App**:
   - Click "Create an App"
   - Enter App Name: `Your API Name`
   - Enter App Description: `Node.js API for playlist integration`
   - Check the terms of service boxes
   - Click "Create"
4. **Get Your Credentials**:
   - Click on your newly created app
   - You'll see your **Client ID** - copy this
   - Click "Show Client Secret" to reveal your **Client Secret** - copy this
   - Add both to your `.env` file

### 🔐 Authentication Flow Used:

This API uses **Client Credentials Flow** which provides:

- ✅ Access to public playlists and tracks
- ✅ Search functionality across Spotify's catalog
- ✅ Artist and album information
- ❌ No access to user's private data
- ❌ Limited access to some Spotify curated playlists

Perfect for server-to-server applications that don't need user authentication!

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

### 🧪 Testing Spotify Integration

#### 1. **Test Spotify Connection First**

Before testing the API endpoints, verify your Spotify credentials work:

```bash
# Run the Spotify connection tester
node src/scripts/test-spotify.js
```

This script will:

- ✅ Verify your credentials are set correctly
- ✅ Test authentication with Spotify
- ✅ Find working playlist IDs you can use
- ✅ Provide curl commands for testing

#### 2. **Test API Endpoints**

Once your Spotify connection works, test the API:

```bash
# Test basic health endpoint
curl http://localhost:3000/api/health

# Test Spotify playlist endpoint (use a working playlist ID from the test script)
curl -i "http://localhost:3000/api/playlists/1h0CEZCm6IbFTbxThn6Xcs?limit=5"

# Test caching (second request should show X-Cache: HIT)
curl -i "http://localhost:3000/api/playlists/1h0CEZCm6IbFTbxThn6Xcs?limit=5"

# View cache statistics (development mode)
curl http://localhost:3000/api/cache/stats
```

#### 3. **Interactive API Testing**

Use Swagger UI for easy testing:

- Open `http://localhost:3000/docs` in your browser
- Find the `/api/playlists/{id}` endpoint
- Click "Try it out"
- Enter a playlist ID (e.g., `1h0CEZCm6IbFTbxThn6Xcs`)
- Set limit to `5` for quick testing
- Click "Execute"

#### 📝 **Playlist ID Notes**

- **Working Example**: `1h0CEZCm6IbFTbxThn6Xcs` (Classical music playlist)
- **May Not Work**: `37i9dQZF1DXcBWIGoYBM5M` (Spotify's curated playlists often restricted)
- **Finding More**: Use the test script to discover accessible playlists

## Environment Variables

The following environment variables can be configured in your .env file:

```bash
# Server Configuration
NODE_ENV=development    # development, production, or test
PORT=3000              # Port number for the server
API_PREFIX=/api        # Prefix for all API routes

# Spotify Web API Configuration
SPOTIFY_CLIENT_ID=your_client_id       # Spotify application client ID
SPOTIFY_CLIENT_SECRET=your_secret       # Spotify application client secret

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

### Spotify API Testing

- `node src/scripts/test-spotify.js` - Test Spotify API connection and find working playlists

## 🎵 Spotify Integration Guide

### ⚡ Quick Start

1. **Get Spotify Credentials**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Add to .env**: `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
3. **Test Connection**: `node src/scripts/test-spotify.js`
4. **Try API**: `curl "http://localhost:3000/api/playlists/1h0CEZCm6IbFTbxThn6Xcs?limit=5"`
5. **View Docs**: `http://localhost:3000/docs`

### 🔧 Setup Checklist

Before using the Spotify features, ensure you have:

- [ ] Created a Spotify Developer account
- [ ] Created a new app in Spotify Dashboard
- [ ] Added `SPOTIFY_CLIENT_ID` to your `.env` file
- [ ] Added `SPOTIFY_CLIENT_SECRET` to your `.env` file
- [ ] Ran `node src/scripts/test-spotify.js` successfully
- [ ] Found at least one working playlist ID

### 🚨 Troubleshooting Common Issues

#### "Playlist not found" (404 Error)

**Problem**: Getting 404 errors when accessing playlists
**Cause**: Client Credentials flow has limited access to certain playlists
**Solutions**:

1. **Use the test script**: `node src/scripts/test-spotify.js` to find working playlists
2. **Try public user playlists**: Spotify's curated playlists often aren't accessible
3. **Create your own public playlist**: Make a playlist public in Spotify and use its ID

#### "Spotify API not configured" (503 Error)

**Problem**: API returns 503 Service Unavailable
**Cause**: Missing or incorrect Spotify credentials
**Solutions**:

1. Check your `.env` file has both `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
2. Verify credentials are correct (no extra spaces or quotes)
3. Restart your development server after adding credentials

#### Authentication Errors

**Problem**: "Authentication failed" messages
**Cause**: Invalid credentials or network issues
**Solutions**:

1. Double-check credentials in Spotify Dashboard
2. Ensure you copied the full Client ID and Secret
3. Check if your app is properly created in Spotify Dashboard
4. Verify internet connection for API calls

### 🎯 Finding Playlist IDs

To find Spotify playlist IDs:

1. **From Spotify App**:
   - Right-click any playlist → "Share" → "Copy Spotify URI"
   - Extract ID from `spotify:playlist:PLAYLIST_ID`

2. **From Web Player**:
   - Open playlist in browser
   - Copy ID from URL: `https://open.spotify.com/playlist/PLAYLIST_ID`

3. **Using Our Test Script**:
   - Run `node src/scripts/test-spotify.js`
   - Script will test multiple playlists and show working ones

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

### 🎵 Spotify Web API Endpoints

#### Playlist Tracks Endpoint

**GET** `/api/playlists/{id}`

Retrieves tracks from a Spotify playlist with intelligent caching.

**Parameters:**

- `id` (path, required): Spotify playlist ID
- `limit` (query, optional): Number of tracks to return (1-50, default: 50)
- `offset` (query, optional): Number of tracks to skip (default: 0)

**Example Requests:**

```bash
# Get first 5 tracks from a playlist
GET /api/playlists/1h0CEZCm6IbFTbxThn6Xcs?limit=5

# Get tracks 20-30 from a playlist (pagination)
GET /api/playlists/1h0CEZCm6IbFTbxThn6Xcs?limit=10&offset=20

# Get all tracks (up to 50, default)
GET /api/playlists/1h0CEZCm6IbFTbxThn6Xcs
```

**Response Headers:**

- `X-Cache`: `MISS` (first request) or `HIT` (cached)
- `X-Cache-Key`: Cache key used for this request
- `Content-Type`: `application/json`

**Example Response:**

```json
{
  "message": "Playlist tracks retrieved successfully",
  "playlistId": "1h0CEZCm6IbFTbxThn6Xcs",
  "tracks": [
    {
      "id": "17mTPR6CmBQu8AsgBRPsw4",
      "name": "Carnival of the Animals: The Swan",
      "artist": "Camille Saint-Saëns, Isata Kanneh-Mason",
      "album": "Carnival",
      "duration_ms": 150146,
      "preview_url": null,
      "spotify_url": "https://open.spotify.com/track/17mTPR6CmBQu8AsgBRPsw4",
      "added_at": "2025-09-24T13:43:02Z",
      "image": "https://i.scdn.co/image/ab67616d0000b27391edd074acff0cf1690a3733"
    }
  ],
  "pagination": {
    "total": 234,
    "limit": 5,
    "offset": 0
  },
  "cached": false
}
```

**Error Responses:**

- `400`: Invalid playlist ID format
- `404`: Playlist not found or not accessible
- `503`: Spotify API not configured

#### System Endpoints

```bash
# Health check with Redis and Spotify status
GET /api/health
Response: {
  "status": "ok",
  "env": "development",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "redis": { "cache": true, "logs": true, "pubsub": true },
  "cache": { "totalKeys": 0, "memoryUsage": "1.42M", "hitRate": 27.54 }
}

# Cache statistics (development only)
GET /api/cache/stats
Response: { "message": "Cache statistics retrieved", "stats": { "totalKeys": 5, "memoryUsage": "1.2MB", "hitRate": 85.3, "keys": ["playlist:GET:/api/playlists/123"] } }

# Clear cache (development only)
DELETE /api/cache/clear?pattern=playlist:*
Response: { "message": "Cache cleared", "pattern": "playlist:*", "deleted": 3, "keys": 3 }
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
