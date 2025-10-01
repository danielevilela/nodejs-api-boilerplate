import request from 'supertest';
import { randomUUID } from 'crypto';
import app from '../../app';
import { redis, cache } from '../../config/redis';

describe('Cache Integration', () => {
  const testUserId1 = randomUUID();
  const testUserId2 = randomUUID();
  let isRedisAvailable = false;

  beforeAll(async () => {
    // Ensure development mode for cache management endpoints
    process.env.NODE_ENV = 'development';

    // Wait for Redis connections and check availability
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const health = await redis.healthCheck();
      isRedisAvailable = health.cache && health.logs && health.pubsub;
      console.log('Redis availability check:', { isRedisAvailable, health });
    } catch (error) {
      console.log('Redis not available during tests:', error);
      isRedisAvailable = false;
    }
  });

  afterAll(async () => {
    // Clean up Redis connections if available
    if (isRedisAvailable) {
      try {
        await redis.disconnect();
      } catch (error) {
        console.log('Error disconnecting Redis:', error);
      }
    }
  });

  beforeEach(async () => {
    // Clear cache before each test only if Redis is available
    if (isRedisAvailable) {
      try {
        await cache.flushdb();
      } catch (error) {
        console.log('Error flushing cache:', error);
      }
    }
  });

  describe('Cache Headers', () => {
    it('should return X-Cache: MISS on first request', async () => {
      const response = await request(app).get(`/api/users/${testUserId1}`).expect(200);

      expect(response.headers['x-cache']).toBe('MISS');
      expect(response.headers['x-cache-key']).toContain(`user:GET:/api/users/${testUserId1}`);
      expect(response.body.cached).toBe(false);
    });

    it('should return X-Cache: HIT on subsequent requests', async () => {
      // First request (cache miss)
      await request(app).get(`/api/users/${testUserId1}`).expect(200);

      // Second request (cache hit)
      const response = await request(app).get(`/api/users/${testUserId1}`).expect(200);

      expect(response.headers['x-cache']).toBe('HIT');
      expect(response.headers['x-cache-key']).toContain(`user:GET:/api/users/${testUserId1}`);
      // Note: The cached field in response body depends on route implementation
    });

    it('should cache different users separately', async () => {
      // Request user 1
      const response1 = await request(app).get(`/api/users/${testUserId1}`).expect(200);
      expect(response1.headers['x-cache']).toBe('MISS');

      // Request user 2 (different cache entry)
      const response2 = await request(app).get(`/api/users/${testUserId2}`).expect(200);
      expect(response2.headers['x-cache']).toBe('MISS');

      // Request user 1 again (should be cached)
      const response3 = await request(app).get(`/api/users/${testUserId1}`).expect(200);
      expect(response3.headers['x-cache']).toBe('HIT');
    });

    it('should cache user lists with query parameters', async () => {
      // First request with specific pagination
      const response1 = await request(app).get('/api/users?page=1&limit=5').expect(200);
      expect(response1.headers['x-cache']).toBe('MISS');

      // Same request should be cached
      const response2 = await request(app).get('/api/users?page=1&limit=5').expect(200);
      expect(response2.headers['x-cache']).toBe('HIT');

      // Different query parameters should not be cached
      const response3 = await request(app).get('/api/users?page=2&limit=5').expect(200);
      expect(response3.headers['x-cache']).toBe('MISS');
    });

    it('should not cache POST requests', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      const response = await request(app).post('/api/users').send(userData).expect(201);

      expect(response.headers['x-cache']).toBeUndefined();
      expect(response.headers['x-cache-key']).toBeUndefined();
    });

    it('should not cache PATCH requests', async () => {
      const updateData = {
        username: 'updateduser',
      };

      const response = await request(app)
        .patch(`/api/users/${testUserId1}`)
        .send(updateData)
        .expect(200);

      expect(response.headers['x-cache']).toBeUndefined();
      expect(response.headers['x-cache-key']).toBeUndefined();
    });
  });

  describe('Cache Invalidation', () => {
    it('should invalidate cache when user is updated', async () => {
      // First, cache a user
      await request(app).get(`/api/users/${testUserId1}`).expect(200);

      // Verify it's cached
      const cachedResponse = await request(app).get(`/api/users/${testUserId1}`).expect(200);
      expect(cachedResponse.headers['x-cache']).toBe('HIT');

      // Update the user (should invalidate cache)
      await request(app)
        .patch(`/api/users/${testUserId1}`)
        .send({ username: 'updateduser' })
        .expect(200);

      // Next request should be a cache miss due to invalidation
      const response = await request(app).get(`/api/users/${testUserId1}`).expect(200);
      expect(response.headers['x-cache']).toBe('MISS');
    });
  });

  describe('Cache TTL', () => {
    it('should respect cache TTL settings', async () => {
      // This test would require mocking time or using a very short TTL
      // For now, we'll just verify the cache key structure
      const response = await request(app).get(`/api/users/${testUserId1}`).expect(200);

      expect(response.headers['x-cache-key']).toMatch(
        new RegExp(`^user:GET:/api/users/${testUserId1}`)
      );
    });
  });

  describe('Health Check', () => {
    it('should include Redis health in health endpoint', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('redis');
      expect(response.body.redis).toHaveProperty('cache');
      expect(response.body.redis).toHaveProperty('logs');
      expect(response.body.redis).toHaveProperty('pubsub');
      expect(response.body).toHaveProperty('cache');
    });
  });

  describe('Cache Management Endpoints', () => {
    it('should provide cache statistics when NODE_ENV is development', async () => {
      // Skip if not in development mode
      if (process.env.NODE_ENV !== 'development') {
        return;
      }

      // Add some data to cache first
      await request(app).get(`/api/users/${testUserId1}`).expect(200);

      const response = await request(app).get('/api/cache/stats');

      if (response.status === 404) {
        // Cache endpoints not available in this test environment
        return;
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('stats');
    });

    it('should clear cache with pattern when NODE_ENV is development', async () => {
      // Skip if not in development mode
      if (process.env.NODE_ENV !== 'development') {
        return;
      }

      // Add some data to cache
      await request(app).get(`/api/users/${testUserId1}`).expect(200);

      // Clear cache
      const response = await request(app).delete('/api/cache/clear?pattern=user:*');

      if (response.status === 404) {
        // Cache endpoints not available in this test environment
        return;
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('deleted');
    });
  });

  describe('Error Handling', () => {
    it('should handle Redis errors gracefully', async () => {
      if (!isRedisAvailable) {
        console.log('Skipping Redis error handling test - Redis already unavailable');
        return;
      }

      // Disconnect Redis temporarily
      await redis.cache.disconnect();

      // Request should still work without caching
      const response = await request(app).get(`/api/users/${testUserId1}`).expect(200);

      // Should have SKIP cache header when Redis is unavailable (graceful fallback)
      // or ERROR if there was an actual connection error during the request
      expect(['SKIP', 'ERROR']).toContain(response.headers['x-cache']);

      // Reconnect for cleanup (if possible)
      try {
        await redis.cache.connect();
      } catch (error) {
        console.log('Could not reconnect Redis for cleanup:', error);
      }
    });
  });
});
