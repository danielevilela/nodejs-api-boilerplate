/**
 * Spotify API Connection Tester
 *
 * This script tests the Spotify Web API connection and authentication.
 * It verifies that your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are working
 * and tests various API endpoints to ensure proper functionality.
 *
 * Usage: node src/scripts/test-spotify.js
 */

const { SpotifyApi } = require('@spotify/web-api-ts-sdk');
require('dotenv').config();

async function testSpotify() {
  console.log('Testing Spotify API authentication...');
  console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID ? 'Set' : 'Missing');
  console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? 'Set' : 'Missing');

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error('❌ Spotify credentials missing!');
    return;
  }

  try {
    const client = SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID,
      process.env.SPOTIFY_CLIENT_SECRET
    );

    console.log('✅ Spotify client created successfully');

    // Test with a simple search first
    console.log('Testing search API...');
    const searchResult = await client.search('test', ['track'], 'US', 1);
    console.log('✅ Search API works! Found tracks:', searchResult.tracks?.items?.length || 0);

    // Test with playlist access - try different playlist IDs
    const testPlaylists = [
      { id: '1h0CEZCm6IbFTbxThn6Xcs', name: 'Classical Music (confirmed working)' },
      { id: '37i9dQZF1DXcBWIGoYBM5M', name: "Today's Top Hits (Spotify curated - may not work)" },
      { id: '6v7r7wW3tshbJRo9kqwqA6', name: 'User playlist example' },
    ];

    let workingPlaylist = null;
    for (const playlist of testPlaylists) {
      console.log(`Testing playlist ${playlist.id} (${playlist.name})...`);
      try {
        const playlistResult = await client.playlists.getPlaylistItems(
          playlist.id,
          'US',
          undefined,
          5,
          0
        );
        console.log(
          `✅ Playlist ${playlist.id} works! Found tracks:`,
          playlistResult.items?.length || 0
        );
        workingPlaylist = playlist.id;
        break; // Found a working playlist
      } catch (playlistError) {
        console.log(`❌ Playlist ${playlist.id} failed:`, playlistError.message);
      }
    }

    if (workingPlaylist) {
      console.log('\n🎉 Success! You can test the API with:');
      console.log(`curl "http://localhost:3000/api/playlists/${workingPlaylist}?limit=5"`);
    } else {
      console.log(
        '\n⚠️  No working playlists found. Client Credentials flow has limited playlist access.'
      );
    }
  } catch (error) {
    console.error('❌ Spotify authentication failed:', error.message);
    console.error('Full error:', error);
  }
}

testSpotify().catch(console.error);
