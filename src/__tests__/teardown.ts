// Global teardown - runs after all test suites complete

export default async function globalTeardown() {
  try {
    // Import Redis manager to clean up all connections
    const { redis } = await import('../config/redis');
    
    // Properly disconnect all Redis connections
    if (redis.cache?.status === 'ready') {
      await redis.cache.quit();
    }
    if (redis.logs?.status === 'ready') {
      await redis.logs.quit();
    }
    if (redis.pubsub?.status === 'ready') {
      await redis.pubsub.quit();
    }
    
    console.log('Global teardown: All Redis connections closed');
  } catch {
    console.log('Global teardown: Redis cleanup completed with warnings');
  }
}