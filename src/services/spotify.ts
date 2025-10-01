import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { config } from '../config/env';
import { logger } from '../utils/logger';

class SpotifyService {
  private client: SpotifyApi | null = null;

  constructor(
    private clientId: string = config.spotify.clientId || '',
    private clientSecret: string = config.spotify.clientSecret || ''
  ) {
    this.initializeClient();
  }

  /**
   * Initialize Spotify client with Client Credentials flow
   */
  private initializeClient(): void {
    if (!this.isConfigured()) {
      logger.warn('Spotify API not configured - missing credentials');
      return;
    }

    try {
      this.client = SpotifyApi.withClientCredentials(this.clientId, this.clientSecret);
      logger.info('Spotify client initialized successfully');
    } catch (error) {
      logger.error({ err: error }, 'Failed to initialize Spotify client');
    }
  }

  /**
   * Check if Spotify API is configured
   */
  public isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  /**
   * Check if client is ready
   */
  public isReady(): boolean {
    return this.client !== null;
  }

  /**
   * Get client instance (throws if not configured)
   */
  private getClient(): SpotifyApi {
    if (!this.client) {
      throw new Error(
        'Spotify API not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET'
      );
    }
    return this.client;
  }

  /**
   * Get playlist tracks
   */
  public async getPlaylistTracks(playlistId: string, limit: number = 50, offset: number = 0) {
    const client = this.getClient();

    try {
      // Use a valid limit value (SDK has strict type checking)
      const validLimit = Math.min(Math.max(limit, 1), 50) as 50;

      const result = await client.playlists.getPlaylistItems(
        playlistId,
        'US' as const, // market
        undefined, // fields
        validLimit,
        offset
      );

      logger.info(
        { playlistId, limit: validLimit, offset, total: result.total },
        'Fetched playlist tracks'
      );
      return result;
    } catch (error) {
      logger.error({ err: error, playlistId }, 'Failed to fetch playlist tracks');
      throw error;
    }
  }

  /**
   * Search for tracks, artists, albums, etc.
   */
  public async search(
    query: string,
    types: Array<'track' | 'artist' | 'album' | 'playlist'> = ['track'],
    limit: number = 20,
    offset: number = 0
  ) {
    const client = this.getClient();

    try {
      // Ensure limit is within valid range
      const validLimit = Math.min(Math.max(limit, 1), 50) as 50;
      const result = await client.search(query, types, 'US' as const, validLimit, offset);
      logger.info({ query, types, limit: validLimit, offset }, 'Search completed');
      return result;
    } catch (error) {
      logger.error({ err: error, query }, 'Search failed');
      throw error;
    }
  }

  /**
   * Get artist by ID
   */
  public async getArtist(artistId: string) {
    const client = this.getClient();

    try {
      const result = await client.artists.get(artistId);
      logger.info({ artistId, name: result.name }, 'Fetched artist');
      return result;
    } catch (error) {
      logger.error({ err: error, artistId }, 'Failed to fetch artist');
      throw error;
    }
  }

  /**
   * Get artist's top tracks
   */
  public async getArtistTopTracks(artistId: string) {
    const client = this.getClient();

    try {
      const result = await client.artists.topTracks(artistId, 'US' as const);
      logger.info({ artistId, trackCount: result.tracks.length }, 'Fetched artist top tracks');
      return result;
    } catch (error) {
      logger.error({ err: error, artistId }, 'Failed to fetch artist top tracks');
      throw error;
    }
  }

  /**
   * Get featured playlists
   */
  public async getFeaturedPlaylists(limit: number = 20, offset: number = 0) {
    const client = this.getClient();

    try {
      // Get featured playlists - parameters might be optional based on SDK
      const result = await client.browse.getFeaturedPlaylists();
      logger.info({ limit, offset }, 'Fetched featured playlists');
      return result;
    } catch (error) {
      logger.error({ err: error }, 'Failed to fetch featured playlists');
      throw error;
    }
  }
}

// Export singleton instance
export const spotifyService = new SpotifyService();
