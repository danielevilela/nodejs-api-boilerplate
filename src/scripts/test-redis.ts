import { redis, cache, logs, pubsub } from '../config/redis';
import { logger } from '../utils/logger';

/**
 * Test Redis connections and basic operations
 */
export async function testRedisConnection(): Promise<void> {
  try {
    logger.info('Starting Redis connection tests...');

    // Test health check
    const health = await redis.healthCheck();
    logger.info({ health }, 'Redis health check results');

    if (!health.cache || !health.logs || !health.pubsub) {
      throw new Error('One or more Redis connections failed');
    }

    // Test cache operations
    logger.info('Testing cache operations...');
    await cache.set('test:cache', 'Hello Redis Cache!', 'EX', 60);
    const cacheValue = await cache.get('test:cache');
    logger.info({ cacheValue }, 'Cache test result');

    // Test logs operations (Redis Streams)
    logger.info('Testing logs operations...');
    const logEntry = await logs.xadd(
      'test-logs',
      '*',
      'level',
      'info',
      'message',
      'Test log entry',
      'timestamp',
      Date.now().toString(),
      'service',
      'nodejs-api'
    );
    logger.info({ logEntry }, 'Log entry created');

    // Read back the log entry
    const logEntries = await logs.xread('STREAMS', 'test-logs', '0');
    logger.info({ logEntries }, 'Log entries retrieved');

    // Test pub/sub
    logger.info('Testing pub/sub operations...');

    // Subscribe to a test channel
    const subscriber = pubsub.duplicate();
    subscriber.subscribe('test-channel');

    subscriber.on('message', (channel, message) => {
      logger.info({ channel, message }, 'Received pub/sub message');
    });

    // Publish a test message
    await pubsub.publish('test-channel', 'Hello Pub/Sub!');

    // Wait a bit for the message to be received
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Cleanup
    await subscriber.unsubscribe('test-channel');
    await subscriber.quit();
    await cache.del('test:cache');
    await logs.del('test-logs');

    logger.info('✅ All Redis tests passed successfully!');
  } catch (error) {
    logger.error({ err: error }, '❌ Redis connection test failed');
    throw error;
  }
}

/**
 * Simple Redis ping test
 */
export async function pingRedis(): Promise<boolean> {
  try {
    const results = await Promise.all([cache.ping(), logs.ping(), pubsub.ping()]);

    const allPonged = results.every((result) => result === 'PONG');

    if (allPonged) {
      logger.info('✅ Redis ping successful on all connections');
      return true;
    } else {
      logger.warn('⚠️ Some Redis connections failed ping test');
      return false;
    }
  } catch (error) {
    logger.error({ err: error }, '❌ Redis ping failed');
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testRedisConnection()
    .then(() => {
      logger.info('Redis tests completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error({ err: error }, 'Redis tests failed');
      process.exit(1);
    });
}
