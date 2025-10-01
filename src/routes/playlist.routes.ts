import { Router } from 'express';
import { validate } from '../middleware/validate';
import { cacheMiddleware } from '../middleware/cache';
import { getPlaylistSchema } from '../schemas/playlist.schema';
import { spotifyService } from '../services/spotify';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Get tracks from a Spotify playlist
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Spotify playlist ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 50
 *         description: Number of tracks to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of tracks to skip
 *     responses:
 *       200:
 *         description: Playlist tracks retrieved successfully
 *         headers:
 *           X-Cache:
 *             $ref: '#/components/headers/X-Cache'
 *           X-Cache-Key:
 *             $ref: '#/components/headers/X-Cache-Key'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Playlist tracks retrieved successfully
 *                 playlistId:
 *                   type: string
 *                   example: "37i9dQZF1DXcBWIGoYBM5M"
 *                 tracks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       artist:
 *                         type: string
 *                       album:
 *                         type: string
 *                       duration_ms:
 *                         type: number
 *                       preview_url:
 *                         type: string
 *                         nullable: true
 *                       spotify_url:
 *                         type: string
 *                       added_at:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                 cached:
 *                   type: boolean
 *       400:
 *         description: Invalid playlist ID
 *       404:
 *         description: Playlist not found
 *       503:
 *         description: Spotify API unavailable
 */
router.get(
  '/:id',
  validate(getPlaylistSchema),
  cacheMiddleware({ ttl: 1800, keyPrefix: 'playlist' }), // Cache for 30 minutes
  async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      // Check if Spotify is configured
      if (!spotifyService.isConfigured()) {
        return res.status(503).json({
          message: 'Spotify API not configured',
          error: 'Please configure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET',
        });
      }

      logger.info({ playlistId: id, limit, offset }, 'Fetching playlist tracks');

      const playlistData = await spotifyService.getPlaylistTracks(
        id,
        Number(limit),
        Number(offset)
      );

      // Transform the data to a cleaner format
      const tracks = playlistData.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists.map((artist) => artist.name).join(', '),
        album: item.track.album.name,
        duration_ms: item.track.duration_ms,
        preview_url: item.track.preview_url,
        spotify_url: item.track.external_urls.spotify,
        added_at: item.added_at,
        image: item.track.album.images[0]?.url || null,
      }));

      res.json({
        message: 'Playlist tracks retrieved successfully',
        playlistId: id,
        tracks,
        pagination: {
          total: playlistData.total,
          limit: playlistData.limit,
          offset: playlistData.offset,
        },
        cached: res.get('X-Cache') === 'HIT',
      });
    } catch (error) {
      req.log?.error({ err: error, playlistId: req.params.id }, 'Failed to fetch playlist tracks');

      if (error instanceof Error && error.message.includes('404')) {
        return res.status(404).json({
          message: 'Playlist not found',
          error: 'The specified playlist was not found or is not accessible',
        });
      }

      res.status(500).json({
        message: 'Failed to fetch playlist tracks',
        error: 'An error occurred while fetching data from Spotify',
      });
    }
  }
);

export default router;
