export async function GET(req) {
    const { headers } = req;
    const token = headers.get("Authorization")?.split("Bearer ")[1];
  
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  
    try {
      const tracksRes = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tracks = await tracksRes.json();
  
      const artistsRes = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const artists = await artistsRes.json();
  
      return new Response(
        JSON.stringify({
          topTracks: tracks.items || [],
          topArtists: artists.items || [],
        }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
  }
  