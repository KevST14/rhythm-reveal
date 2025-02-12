export default async function fetchSpotifyInsights(accessToken) {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/top/artists", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const artistsData = await res.json();
  
      const res2 = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const tracksData = await res2.json();
  
      return {
        topGenres: [...new Set(artistsData.items.flatMap(artist => artist.genres))].slice(0, 5),
        topArtists: artistsData.items.map(artist => artist.name).slice(0, 5),
        weeklyTrends: tracksData.items.map(track => Math.floor(Math.random() * 150)),
      };
    } catch (error) {
      console.error("Spotify API error:", error);
      return { topGenres: [], topArtists: [], weeklyTrends: [] };
    }
  }
  