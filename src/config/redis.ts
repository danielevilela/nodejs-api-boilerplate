import Redis from 'ioredis';
import { logger } from '../utils/logger';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
  retryDelayOnTimeout?: number;
  connectTimeout?: number;
}

import { config } from './env';

// Default Redis configuration
const defaultConfig: RedisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: 0,
  retryDelayOnFailover: config.isDevelopment ? 100 : 1000,
  maxRetriesPerRequest: config.isDevelopment ? 3 : 1, // Reduce retries in CI
  lazyConnect: true,
  connectTimeout: config.isDevelopment ? 10000 : 5000, // 5s timeout in CI
  retryDelayOnTimeout: config.isDevelopment ? 200 : 1000,
};

// Create Redis instances for different use cases
class RedisManager {
  private static instance: RedisManager;
  public cache: Redis;
  public logs: Redis;
  public pubsub: Redis;
  private redisAvailable: boolean = false;
  private connectionAttempted: boolean = false;

  private constructor() {
    // Cache Redis instance (db: 0)
    this.cache = new Redis({
      ...defaultConfig,
      db: 0,
    });

    // Logs Redis instance (db: 1)
    this.logs = new Redis({
      ...defaultConfig,
      db: 1,
    });

    // Pub/Sub Redis instance (db: 2)
    this.pubsub = new Redis({
      ...defaultConfig,
      db: 2,
    });

    this.setupEventHandlers();
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  private setupEventHandlers(): void {
    // Cache Redis events
    this.cache.on('connect', () => {
      this.redisAvailable = true;
      logger.info('Redis cache connected');
    });

    this.cache.on('error', (error) => {
      if (!this.connectionAttempted || config.isDevelopment) {
        logger.error({ err: error }, 'Redis cache connection error');
      }
      this.redisAvailable = false;
      this.connectionAttempted = true;
    });

    this.cache.on('close', () => {
      this.redisAvailable = false;
    });

    // Logs Redis events
    this.logs.on('connect', () => {
      logger.info('Redis logs connected');
    });

    this.logs.on('error', (error) => {
      if (!this.connectionAttempted || config.isDevelopment) {
        logger.error({ err: error }, 'Redis logs connection error');
      }
    });

    // Pub/Sub Redis events
    this.pubsub.on('connect', () => {
      logger.info('Redis pub/sub connected');
    });

    this.pubsub.on('error', (error) => {
      if (!this.connectionAttempted || config.isDevelopment) {
        logger.error({ err: error }, 'Redis pub/sub connection error');
      }
    });
  }

  public isAvailable(): boolean {
    return this.redisAvailable;
  }

  public async disconnect(): Promise<void> {
    if (this.redisAvailable) {
      await Promise.all([this.cache.quit(), this.logs.quit(), this.pubsub.quit()]);
      logger.info('All Redis connections closed');
    } else {
      logger.info('Redis was not connected, no need to disconnect');
    }
  }

  public async healthCheck(): Promise<{ cache: boolean; logs: boolean; pubsub: boolean }> {
    try {
      const [cacheResult, logsResult, pubsubResult] = await Promise.allSettled([
        this.cache.ping(),
        this.logs.ping(),
        this.pubsub.ping(),
      ]);

      return {
        cache: cacheResult.status === 'fulfilled' && cacheResult.value === 'PONG',
        logs: logsResult.status === 'fulfilled' && logsResult.value === 'PONG',
        pubsub: pubsubResult.status === 'fulfilled' && pubsubResult.value === 'PONG',
      };
    } catch (error) {
      logger.error({ err: error }, 'Redis health check failed');
      return { cache: false, logs: false, pubsub: false };
    }
  }
}

// Export singleton instance
export const redis = RedisManager.getInstance();

// Export individual clients for convenience
export const { cache, logs, pubsub } = redis;
