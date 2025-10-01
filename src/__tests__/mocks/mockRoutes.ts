import express from 'express';
import { validate } from '../../middleware/validate';
import { cacheMiddleware } from '../../middleware/cache';
import { getPlaylistSchema } from '../../schemas/playlist.schema';
import { getCacheStats } from '../../middleware/cache';
import { redis } from '../../config/redis';
import { config } from '../../config/env';

const router = express.Router();

// Mock playlist data for testing
const mockPlaylistData = {
  '37i9dQZF1DXcBWIGoYBM5M': {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    name: 'Mock Today\'s Top Hits',
    tracks: [
      {
        id: 'mock-track-1',
        name: 'Mock Song 1',
        artist: 'Mock Artist 1',
        album: 'Mock Album 1',
        duration_ms: 210000,
        preview_url: 'https://example.com/preview1.mp3',
        spotify_url: 'https://open.spotify.com/track/mock-track-1',
        added_at: '2024-01-01T00:00:00Z',
        image: 'https://example.com/album1.jpg',
      },
      {
        id: 'mock-track-2',
        name: 'Mock Song 2',
        artist: 'Mock Artist 2',
        album: 'Mock Album 2',
        duration_ms: 195000,
        preview_url: 'https://example.com/preview2.mp3',
        spotify_url: 'https://open.spotify.com/track/mock-track-2',
        added_at: '2024-01-02T00:00:00Z',
        image: 'https://example.com/album2.jpg',
      },
    ],
  },
  '37i9dQZF1DX0XUsuxWHRQd': {
    id: '37i9dQZF1DX0XUsuxWHRQd',
    name: 'Mock RapCaviar',
    tracks: [
      {
        id: 'mock-rap-track-1',
        name: 'Mock Rap Song 1',
        artist: 'Mock Rapper 1',
        album: 'Mock Rap Album 1',
        duration_ms: 180000,
        preview_url: 'https://example.com/rap-preview1.mp3',
        spotify_url: 'https://open.spotify.com/track/mock-rap-track-1',
        added_at: '2024-01-03T00:00:00Z',
        image: 'https://example.com/rap-album1.jpg',
      },
    ],
  },
};

/**
 * Mock playlist endpoint for testing cache functionality
 */
router.get(
  '/playlists/:id',
  validate(getPlaylistSchema),
  cacheMiddleware({ ttl: 1800, keyPrefix: 'playlist' }), // Cache for 30 minutes
  async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      req.log?.info({ playlistId: id, limit, offset }, 'Fetching mock playlist tracks');

      // Check if playlist exists in mock data
      const playlist = mockPlaylistData[id as keyof typeof mockPlaylistData];
      if (!playlist) {
        return res.status(404).json({
          message: 'Playlist not found',
          error: 'The specified playlist was not found in mock data',
        });
      }

      // Apply pagination to mock tracks
      const startIndex = Number(offset);
      const endIndex = startIndex + Number(limit);
      const paginatedTracks = playlist.tracks.slice(startIndex, endIndex);

      res.json({
        message: 'Playlist tracks retrieved successfully',
        playlistId: id,
        tracks: paginatedTracks,
        pagination: {
          total: playlist.tracks.length,
          limit: Number(limit),
          offset: Number(offset),
        },
        cached: res.getHeader('X-Cache') === 'HIT',
      });
    } catch (error) {
      req.log?.error({ err: error, playlistId: req.params.id }, 'Failed to fetch mock playlist tracks');

      res.status(500).json({
        message: 'Failed to fetch playlist tracks',
        error: 'An error occurred while fetching mock data',
      });
    }
  }
);

// Health check route
router.get('/health', async (req, res) => {
  req.log?.info('Health check requested');

  try {
    const redisHealth = await redis.healthCheck();
    const cacheStats = await getCacheStats();

    res.json({
      status: 'ok',
      env: config.env,
      timestamp: new Date().toISOString(),
      redis: redisHealth,
      cache: cacheStats,
    });
  } catch (error) {
    req.log?.error({ err: error }, 'Health check failed');
    res.json({
      status: 'ok',
      env: config.env,
      timestamp: new Date().toISOString(),
      redis: { cache: false, logs: false, pubsub: false },
      cache: { totalKeys: 0, memoryUsage: 'unavailable', hitRate: 0 },
      note: 'Redis unavailable',
    });
  }
});

// Cache management routes (development only)
if (config.isDevelopment) {
  router.get('/cache/stats', async (req, res) => {
    try {
      const stats = await getCacheStats();
      res.json({
        message: 'Cache statistics retrieved',
        stats,
      });
    } catch (error) {
      req.log?.error({ err: error }, 'Failed to get cache stats');
      res.status(500).json({ error: 'Failed to get cache stats' });
    }
  });

  router.delete('/cache/clear', async (req, res) => {
    try {
      if (!redis.isAvailable()) {
        return res.json({
          message: 'Cache clear skipped - Redis unavailable',
          pattern: (req.query.pattern as string) || '*',
          deleted: 0,
          keys: 0,
        });
      }

      const pattern = (req.query.pattern as string) || '*';
      const keys = await redis.cache.keys(pattern);
      const deleted = keys.length > 0 ? await redis.cache.del(...keys) : 0;

      res.json({
        message: 'Cache cleared',
        pattern,
        deleted,
        keys: keys.length,
      });
    } catch (error) {
      req.log?.error({ err: error }, 'Failed to clear cache');
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  });
}

export default router;